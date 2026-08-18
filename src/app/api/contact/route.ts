import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend/config';

// ─── POST /api/contact ────────────────────────────────────────────────────────
// Secure server-side endpoint for contact enquiry emails via Resend.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Honeypot spam check (if bot fills in 'website' or 'company' field)
    if (body.website || body.company || body.hp) {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Length constraints to prevent payload flood
    if (typeof name !== 'string' || name.trim().length > 120) {
      return NextResponse.json(
        { error: 'Name must be 120 characters or fewer.' },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.trim().length > 3000) {
      return NextResponse.json(
        { error: 'Message must be 3000 characters or fewer.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const associationEmail = 'shanmugamsdwa@gmail.com';

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SDWA Website <onboarding@resend.dev>',
        to: associationEmail,
        replyTo: email,
        subject: `New Enquiry from ${name} via SDWA Website`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
            <div style="background-color: #0F172A; padding: 16px; border-radius: 6px 6px 0 0; text-align: center;">
              <h2 style="color: #D97706; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
                Salem District Weightlifting Association
              </h2>
              <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">
                Website Enquiry Notification
              </p>
            </div>
            
            <div style="padding: 20px; background-color: #FFFFFF;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Sender:</td>
                  <td style="padding: 8px 0; color: #0F172A;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 8px 0; color: #0F172A;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${
                  phone
                    ? `<tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone:</td>
                  <td style="padding: 8px 0; color: #0F172A;"><a href="tel:${phone}">${phone}</a></td>
                </tr>`
                    : ''
                }
              </table>
              
              <div style="margin-top: 20px; padding: 16px; background-color: #F8FAFC; border-left: 4px solid #D97706; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; color: #334155; margin-bottom: 8px;">Message:</p>
                <p style="margin: 0; color: #1E293B; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="padding: 12px; background-color: #F1F5F9; border-radius: 0 0 6px 6px; text-align: center; font-size: 12px; color: #64748B;">
              Received via SDWA Official Portal &bull; Reg No: 112 / 2020
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been submitted successfully. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending your message. Please try again later or contact us directly by phone.' },
      { status: 500 }
    );
  }
}
