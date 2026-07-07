import express from "express";
import path from "path";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Trust Vercel's reverse proxy for correct req.ip / headers
app.set("trust proxy", true);

// Enable CORS for allowed origins to prevent redirect blocks
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["https://ffoverseas.in", "https://www.ffoverseas.in"];
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-ORBIT-API-KEY");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Ensure JSON parsing
app.use(express.json());

// In-memory rate limiting (IP-based)
const ipCache = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Helper to parse cookies manually without external dependency
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    list[parts.shift()!.trim()] = decodeURI(parts.join("="));
  });
  return list;
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
        // Normalize any possible double escaped or single escaped newlines
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

    // Attempt to append to "Sheet1"
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

// REST Backend Route: POST /api/enquiries
app.post(/^\/api\/(enquiries|index(\.ts|\.js)?)$/, async (req, res) => {
  try {
    // 1. Session check via cookie
    const cookies = parseCookies(req.headers.cookie);
    if (cookies["ff_enquiry_submitted"]) {
      return res.status(429).json({
        error: "You have already submitted an enquiry in this session."
      });
    }

    // 2. IP address rate limit check
    const clientIp = (req.headers["x-forwarded-for"] as string || req.ip || "").split(",")[0].trim();
    if (clientIp) {
      // Periodic pruning of expired entries to prevent memory leaks
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
        return res.status(429).json({
          error: `Too many submissions. Please wait ${remainingMin} minute(s) before trying again.`
        });
      }
    }

    const { name, email, phone, destination, degree } = req.body;

    // Validate existence of parameters
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required profiles parameters (name, email, or phone)." });
    }

    // Basic type checking and length validation
    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return res.status(400).json({ error: "Invalid name parameter." });
    }
    if (typeof email !== "string" || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email parameter." });
    }
    if (typeof phone !== "string" || phone.length > 30 || !/^[+\d\s().-]{5,25}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number parameter." });
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

    // Run sheet and email async so we don't slow down client response, but track statuses
    const [sheetUpdated, notificationSent] = await Promise.all([
      updateGoogleSheet(newEnquiry),
      sendAdminNotification(newEnquiry),
    ]);

    // 3. Mark session/IP as submitted to prevent multiple submissions
    if (clientIp) {
      ipCache.set(clientIp, Date.now());
    }
    res.cookie("ff_enquiry_submitted", "true", {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Admissions enquiry processed successfully.",
      data: newEnquiry,
      sheetUpdated,
      notificationSent,
    });
  } catch (err: any) {
    console.error("Critical error in POST /api/enquiries Route:", err);
    return res.status(500).json({ error: "Internal Server Error processing student coordinates." });
  }
});

// Proxy other /api calls to FastAPI backend using native fetch (Serverless friendly)
app.all("/api/*", async (req, res) => {
  const targetUrl = `${BACKEND_TARGET}${req.originalUrl}`;
  const apiKey = process.env.BACKEND_API_KEY || process.env.FRONTEND_API_KEY;
  
  const headers: Record<string, string> = {
    "accept": req.headers["accept"] || "*/*",
    "accept-language": req.headers["accept-language"] || "",
    "user-agent": req.headers["user-agent"] || "Mozilla/5.0",
  };
  
  if (req.headers["content-type"]) {
    headers["content-type"] = req.headers["content-type"] as string;
  }
  
  // Inject shared API Key for FastAPI backend authorization
  if (apiKey) {
    headers["x-orbit-api-key"] = apiKey;
  }

  // Forward authorization header if client passed one (e.g. JWT token)
  if (req.headers["authorization"]) {
    headers["authorization"] = req.headers["authorization"] as string;
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
    };

    // Forward the body for POST/PUT/PATCH requests
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get("content-type") || "";

    // Set response headers
    response.headers.forEach((value, key) => {
      if (key !== "content-encoding" && key !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);

    // Bypass body reading for empty body responses (e.g. 304 Not Modified, 204 No Content)
    if (response.status === 304 || response.status === 204) {
      return res.end();
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (err: any) {
    console.error(`Proxy fetch error connecting to ${targetUrl}:`, err);
    return res.status(502).json({
      error: "Bad Gateway",
      message: `Failed to connect to the backend API service at ${BACKEND_TARGET}.`,
      detail: err.message
    });
  }
});

// Setup Vite Development and Production Middleware
async function serveViteApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting full-stack application in development mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting full-stack application in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use("/FFoverseas", express.static(distPath));
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application successfully listening on port ${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  serveViteApp();
}
