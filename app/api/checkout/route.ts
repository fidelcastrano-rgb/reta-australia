import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, address, city, state, postcode, country, shippingMethod, paymentMethod, items, subtotal, shippingCost, total } = data;

    // Server-side verification of payment method and order totals
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    const calculatedShipping = shippingMethod === 'normal' ? 20 : 70;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    if (calculatedTotal < 100 && paymentMethod !== 'crypto') {
      return NextResponse.json({ error: 'Orders below $100 AUD can only be paid via Crypto.' }, { status: 400 });
    }
    if (calculatedTotal < 200 && paymentMethod === 'bank_transfer') {
      return NextResponse.json({ error: 'Bank Transfer is only available for orders above $200 AUD.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'order@reta-australia.com.au';
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let paymentMethodLabel = 'Bank Transfer';
    if (paymentMethod === 'payid') {
      paymentMethodLabel = 'PayID';
    } else if (paymentMethod === 'crypto') {
      paymentMethodLabel = 'Cryptocurrency (USDT/BTC/LTC - Preferred)';
    }

    const orderDetails = `
Order Details:
----------------------------
Items:
${items.map((item: any) => `- ${item.qty}x ${item.name} (${item.variant}) - $${(item.price * item.qty).toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Shipping (${shippingMethod}): $${shippingCost.toFixed(2)}
Total: $${total.toFixed(2)}

Customer Details:
----------------------------
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Address: ${address}, ${city}, ${state} ${postcode}, ${country}

Payment Method: ${paymentMethodLabel}
    `;

    const paymentInstructions = paymentMethod === 'crypto'
      ? `You have selected Cryptocurrency. We will contact you manually with the transfer details shortly. (Crypto is our most preferred option with no delay in confirmation and processing).`
      : `We will contact you manually with the payment details for your chosen payment method (${paymentMethodLabel}) shortly.`;

    const clientEmailText = `
Hi ${firstName},

Thank you for your order with RetaAustralia.

We have successfully received your order. We will review your order details and contact you manually with the custom payment instructions shortly.

Please note that your order will be processed and shipped once your payment has cleared on our end. Once cleared, we will process and ship your order, and your tracking number will be emailed to you. We appreciate your patience.

${paymentInstructions}

${orderDetails}

Best regards,
RetaAustralia Team
    `;

    const adminEmailText = `
New Order Received!

${orderDetails}
    `;

    // Only attempt to send real emails if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send to Admin
      await transporter.sendMail({
        from: `"RetaAustralia Orders" <${smtpUser}>`,
        to: adminEmail,
        subject: `New Order from ${firstName} ${lastName}`,
        text: adminEmailText,
      });

      // Send to Client
      await transporter.sendMail({
        from: `"RetaAustralia" <${smtpUser}>`,
        to: email,
        subject: `Your Order Confirmation - RetaAustralia`,
        text: clientEmailText,
      });
      
      console.log('Checkout emails sent successfully.');
    } else {
      console.log('No SMTP configuration found. Order logged locally:');
      console.log('--- ADMIN EMAIL ---');
      console.log(adminEmailText);
      console.log('--- CLIENT EMAIL ---');
      console.log(clientEmailText);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
