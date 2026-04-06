import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { leadEmailTemplate } from '@/components/lead-email';

export async function POST(req: NextRequest) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';
  const RESEND_LEAD_SEGMENT_ID = process.env.RESEND_LEAD_SEGMENT_ID || '';

  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in environment variables");
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { email } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Add user to the main audience list and attach them to the custom segment
    if (RESEND_AUDIENCE_ID) {
      const payload: any = {
        email,
        unsubscribed: false,
        audience_id: RESEND_AUDIENCE_ID,
      };

      if (RESEND_LEAD_SEGMENT_ID) {
        payload.segments = [
          { id: RESEND_LEAD_SEGMENT_ID }
        ];
      }

      await fetch('https://api.resend.com/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("RESEND_AUDIENCE_ID is not set. Skipping contact list addition.");
    }

    // Send the welcome email
    await resend.emails.send({
      from: 'Sasha Ray <sasha.ray@n8ndevelopers.com>',
      to: email,
      subject: 'Claim Your $200 Coupon — Let\'s Get You Started 🚀',
      html: leadEmailTemplate(),
    });

    return NextResponse.json(
      { message: "Lead processed and welcome email sent!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending welcome email via Resend:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
