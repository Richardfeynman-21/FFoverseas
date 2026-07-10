import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

// In-memory rate limiting (IP-based) for local/persistent instances
const ipCache = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Helper: basic string sanitization to prevent XSS
function sanitizeString(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// 1. Google Sheets Integration Function
async function updateGoogleSheet(data: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  degree: string;
  timestamp: string;
}): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.warn("GOOGLE_SPREADSHEET_ID is not configured. Skipping Google Sheets update.");
    return false;
  }

  let authClient: any = null;

  // Option A: Service Account JSON
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const keys = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (keys.private_key) {
        let cleanedKey = keys.private_key;
        cleanedKey = cleanedKey.replace(/\\n/g, "\n");
        cleanedKey = cleanedKey.replace(/\r/g, "");
        cleanedKey = cleanedKey.trim();
        keys.private_key = cleanedKey;
      }
      authClient = google.auth.fromJSON(keys);
      if (authClient && "scopes" in authClient) {
        authClient.scopes = ["https://www.googleapis.com/auth/spreadsheets"];
      }
      console.log("Authenticated Google Sheets API using Service Account.");
    } catch (err) {
      console.error("Failed to authenticate Google Sheets with Service Account:", err);
    }
  }

  // Option B: OAuth Client refresh token (fallback/alternative)
  if (!authClient && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
      authClient = oauth2Client;
      console.log("Authenticated Google Sheets API using OAuth credentials.");
    } catch (err) {
      console.error("Failed to authenticate Google Sheets with OAuth credentials:", err);
    }
  }

  if (!authClient) {
    console.warn("No Google Sheet authentication credentials available in environment. Skipping Google Sheets update.");
    return false;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth: authClient });
    
    const values = [
      [
        data.timestamp,
        data.name,
        data.email,
        data.phone,
        data.destination.toUpperCase(),
        data.degree.toUpperCase(),
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log(`Successfully synced submission score of ${data.name} to Google Sheets ID ${spreadsheetId}.`);
    return true;
  } catch (err) {
    console.error("Error executing append row request on Google Sheets API:", err);
    return false;
  }
}

// 2. Nodemailer Notification email to Admin
async function sendAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  degree: string;
  timestamp: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL is not configured. Skipping admin notification.");
    return false;
  }

  let transporter: any = null;

  // Option A: Custom SMTP host configuration (preferred)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log("SMTP mail transport initialized.");
    } catch (err) {
      console.error("Failed to construct SMTP transporter config:", err);
    }
  }
  // Option B: OAuth Client using Admin's Gmail Account (fallback)
  else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: adminEmail,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      });
      console.log("Gmail OAuth2 mail transport initialized.");
    } catch (err) {
      console.error("Failed to construct Gmail OAuth transporter config:", err);
    }
  }

  if (!transporter) {
    console.warn("No SMTP or OAuth email settings configured. Skipping admin notification.");
    return false;
  }

  try {
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 25px; color: #001F3F; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; background-color: #ffffff;">
        <div style="display: flex; align-items: center; border-bottom: 2px solid #FF0000; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #001F3F; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">
            🚀 Fly & Flourish <span style="color: #FF0000;">Enquiry Active Route</span>
          </h2>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">
          A new academic flight coordinates inquiry has been submitted by a student through the portal. Details of the candidate below:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr style="background-color: #f7fafc;">
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; width: 140px; color: #4a5568; font-family: monospace;">STUDENT NAME</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #1a202c; font-weight: 600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; color: #4a5568; font-family: monospace;">EMAIL ADDRESS</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #1a202c;">
              <a href="mailto:${data.email}" style="color: #FF0000; text-decoration: none; border-bottom: 1px dashed #FF0000;">${data.email}</a>
            </td>
          </tr>
          <tr style="background-color: #f7fafc;">
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; color: #4a5568; font-family: monospace;">MOBILE CONTACT</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #1a202c;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; color: #4a5568; font-family: monospace;">DESTINATION</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #001F3F; font-weight: bold; text-transform: uppercase;">✈️ ${data.destination}</td>
          </tr>
          <tr style="background-color: #f7fafc;">
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; color: #4a5568; font-family: monospace;">STUDY TRACK</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #1a202c; text-transform: capitalize;">${data.degree}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #edf2f7; font-weight: bold; color: #4a5568; font-family: monospace;">TIMESTAMP (UTC)</td>
            <td style="padding: 12px; border: 1px solid #edf2f7; color: #718096; font-size: 11px;">${data.timestamp}</td>
          </tr>
        </table>
        
        <div style="background-color: #fdf2f2; border-left: 4px solid #FF0000; padding: 16px; border-radius: 8px; font-size: 13px; color: #9b2c2c; margin-top: 24px;">
          <strong>Senior Architect Note:</strong> Follow up coordinates with the student in under 24 hours to secure maximum application deployment rate.
        </div>
        
        <p style="font-size: 11px; text-align: center; color: #a0aec0; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px;">
          This is an automated notification from the Fly & Flourish Overseas Portal.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Fly & Flourish Admissions" <${process.env.SMTP_USER || adminEmail}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 Student Admissions Alert: ${data.name} (${data.destination.toUpperCase()})`,
      html: htmlBody,
    });

    console.log(`Notification safely sent to Admin (${adminEmail}): ${info.messageId}`);
    return true;
  } catch (err) {
    console.error("Nodemailer error processing outbound notification:", err);
    return false;
  }
}

// Next.js Route Handler for POST /api/enquiries
export async function POST(req: NextRequest) {
  try {
    // 1. Session check via cookie
    const cookie = req.cookies.get("ff_enquiry_submitted");
    if (cookie && cookie.value === "true") {
      return NextResponse.json(
        { error: "You have already submitted an enquiry in this session." },
        { status: 429 }
      );
    }

    // 2. IP address rate limit check
    const clientIp = (req.headers.get("x-forwarded-for") || (req as any).ip || "").split(",")[0].trim();
    if (clientIp) {
      if (ipCache.size > 5000) {
        const now = Date.now();
        for (const [ip, time] of ipCache.entries()) {
          if (now - time > RATE_LIMIT_WINDOW_MS) {
            ipCache.delete(ip);
          }
        }
      }

      const lastSubmission = ipCache.get(clientIp);
      if (lastSubmission && (Date.now() - lastSubmission) < RATE_LIMIT_WINDOW_MS) {
        const remainingMin = Math.ceil((RATE_LIMIT_WINDOW_MS - (Date.now() - lastSubmission)) / 60000);
        return NextResponse.json(
          { error: `Too many submissions. Please wait ${remainingMin} minute(s) before trying again.` },
          { status: 429 }
        );
      }
    }

    const reqBody = await req.json();
    const { name, email, phone, destination, degree } = reqBody;

    // Validate parameters
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required profiles parameters (name, email, or phone)." }, { status: 400 });
    }

    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ error: "Invalid name parameter." }, { status: 400 });
    }
    if (typeof email !== "string" || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email parameter." }, { status: 400 });
    }
    if (typeof phone !== "string" || phone.length > 30 || !/^[+\d\s().-]{5,25}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number parameter." }, { status: 400 });
    }

    // Sanitize parameters to prevent XSS
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedPhone = sanitizeString(phone);
    const sanitizedDestination = sanitizeString(destination || "usa").substring(0, 50);
    const sanitizedDegree = sanitizeString(degree || "master").substring(0, 50);

    const timestamp = new Date().toISOString();
    const newEnquiry = {
      id: "enq_" + Math.random().toString(36).substring(2, 11),
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      destination: sanitizedDestination,
      degree: sanitizedDegree,
      timestamp,
    };

    // Execute sheets update and admin notification concurrently
    const [sheetUpdated, notificationSent] = await Promise.all([
      updateGoogleSheet(newEnquiry),
      sendAdminNotification(newEnquiry),
    ]);

    if (clientIp) {
      ipCache.set(clientIp, Date.now());
    }

    const response = NextResponse.json({
      success: true,
      message: "Admissions enquiry processed successfully.",
      data: newEnquiry,
      sheetUpdated,
      notificationSent,
    });

    // Set submitted cookie
    response.cookies.set("ff_enquiry_submitted", "true", {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return response;
  } catch (err: any) {
    console.error("Critical error in POST /api/enquiries Route:", err);
    return NextResponse.json({ error: "Internal Server Error processing student coordinates." }, { status: 500 });
  }
}
