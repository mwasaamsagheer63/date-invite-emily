import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "responses.json");
// Support comma-separated emails e.g. "a@gmail.com,b@gmail.com"
const TO_EMAILS = (process.env.NOTIFY_EMAIL || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type Response = {
  id: string;
  date: string;
  place: string;
  note: string;
  receivedAt: string;
};

function readResponses(): Response[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeResponses(responses: Response[]) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2));
  } catch (err) {
    // On serverless platforms the filesystem may be read-only outside /tmp.
    // Email remains the source of truth in that case.
    console.error("Could not persist response to disk:", err);
  }
}

async function sendEmail(entry: Response) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || TO_EMAILS.length === 0) {
    console.warn("Resend not configured — skipping email send. RESEND_API_KEY or NOTIFY_EMAIL missing.");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAILS,
    subject: "She said yes 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color:#7a4b5c;">She picked a date 🌹</h2>
        <p><strong>Date:</strong> ${entry.date}</p>
        <p><strong>Place preference:</strong> ${entry.place || "(no preference given)"}</p>
        <p><strong>Note:</strong> ${entry.note || "(none)"}</p>
        <p style="color:#888; font-size:12px;">Received ${entry.receivedAt}</p>
      </div>
    `,
  });

  if (result.error) {
    console.error("Resend error:", JSON.stringify(result.error));
  } else {
    console.log("Email sent successfully to:", TO_EMAILS.join(", "), "| id:", result.data?.id);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, place, note } = body;

    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const entry: Response = {
      id: nanoid(8),
      date,
      place: typeof place === "string" ? place : "",
      note: typeof note === "string" ? note : "",
      receivedAt: new Date().toISOString(),
    };

    const responses = readResponses();
    responses.push(entry);
    writeResponses(responses);

    await sendEmail(entry);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Simple shared-secret check so only you can view results.
  const secret = req.nextUrl.searchParams.get("key");
  if (!process.env.RESULTS_KEY || secret !== process.env.RESULTS_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ responses: readResponses() });
}
