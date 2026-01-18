import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

// 1. Initialize Resend
// Note: This requires RESEND_API_KEY in .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    // 2. Validate Authorization
    // Vercel cron jobs send a special header for authentication
    const authHeader = request.headers.get("Authorization");
    const cronSecret = request.headers.get("x-vercel-cron-auth-key");

    // Accept either Vercel's cron header or manual Bearer token
    const isVercelCron = cronSecret === process.env.CRON_SECRET;
    const isManualTrigger = authHeader === `Bearer ${process.env.REPORT_SECRET}`;

    if (!isVercelCron && !isManualTrigger) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Query Data (Last 24 Hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const newSignups = await prisma.waitlistSignup.findMany({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Check if there's anything to report
    // Determine whether to send an email if 0 signups.
    // Usually, it's nice to know "0 signups" so you know the system is working.
    const count = newSignups.length;

    // 5. Build Email Content
    // A simple HTML table for readability
    const rows = newSignups
      .map(
        (s) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${s.email}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${s.reason || "-"}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${s.category || "-"}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(s.createdAt).toLocaleTimeString()}</td>
            </tr>
        `,
      )
      .join("");

    const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Daily Signups Report</h1>
                <p><strong>${count}</strong> new people joined the waitlist in the last 24 hours.</p>
                
                ${count > 0
        ? `
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 8px;">Email</th>
                            <th style="padding: 8px;">Reason</th>
                            <th style="padding: 8px;">Category</th>
                            <th style="padding: 8px;">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                `
        : '<p style="color: #666;">No activity today.</p>'
      }
                
                <p style="margin-top: 30px; font-size: 12px; color: #888;">
                    Report generated at ${new Date().toLocaleString()}
                </p>
            </div>
        `;

    // 6. Send Email
    const emailResult = await resend.emails.send({
      from: "FrameRights Report <onboarding@resend.dev>", // Use provided test domain or your own
      to: process.env.ADMIN_EMAIL || "user@example.com",
      subject: `Daily Report: ${count} New Signups`,
      html: html,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json({ error: emailResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count,
      id: emailResult.data?.id,
    });
  } catch (error) {
    console.error("Daily report error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
