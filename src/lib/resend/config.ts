import { Resend } from 'resend';

// ─── Resend Email Client ────────────────────────────────────────────────────

export const resend = new Resend(process.env.RESEND_API_KEY);
