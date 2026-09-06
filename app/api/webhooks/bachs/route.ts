import { NextRequest, NextResponse } from 'next/server';
import { verifyBachsWebhookSignature } from '@/lib/bachs';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-bachs-signature');
    const timestamp = req.headers.get('x-bachs-timestamp');

    const webhookSecret = process.env.BACHS_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature && timestamp) {
      const isValid = verifyBachsWebhookSignature(rawBody, timestamp, signature, webhookSecret);
      if (!isValid) {
        console.warn('Invalid Bachs webhook signature received');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = payload.event || payload.type || payload.event_type;
    const eventData = payload.data || payload;

    console.log(`Bachs webhook event received: [${eventType}]`, {
      reference: eventData?.reference || eventData?.metadata?.order_id,
      amount: eventData?.amount,
      currency: eventData?.currency,
    });

    // Handle successful payment collection
    if (eventType === 'collection.succeeded' || eventType === 'checkout.completed') {
      const orderId = eventData?.reference || eventData?.metadata?.order_id;
      const customerEmail = eventData?.customer?.email || eventData?.metadata?.customer_email;
      const customerName = eventData?.customer?.name || eventData?.metadata?.customer_name;
      const amountPaid = eventData?.amount || eventData?.total_amount;
      const currency = eventData?.currency || 'USD';

      console.log(`Payment confirmed for Order #${orderId} (${amountPaid} ${currency})`);

      // Optionally send email confirmation to admin and customer
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const adminEmail = process.env.ADMIN_EMAIL || 'order@reta-australia.com.au';

      if (smtpHost && smtpUser && smtpPass && (customerEmail || adminEmail)) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: smtpUser, pass: smtpPass },
          });

          await transporter.sendMail({
            from: `"RetaAustralia Payment Gateway" <${smtpUser}>`,
            to: adminEmail,
            subject: `[PAID] Credit Card Payment Received for Order #${orderId}`,
            text: `Payment of ${amountPaid} ${currency} successfully collected via Bachs for Order #${orderId}.\nCustomer: ${customerName} (${customerEmail})\nStatus: Ready for Dispatch.`,
          });
        } catch (emailErr) {
          console.error('Failed to dispatch webhook confirmation email:', emailErr);
        }
      }
    }

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (error: any) {
    console.error('Bachs webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 500 });
  }
}
