import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const customer = data.customer || {};
    const firstName = data.firstName || customer.firstName || '';
    const lastName = data.lastName || customer.lastName || '';
    const email = data.email || customer.email || '';
    const phone = data.phone || customer.phone || '';
    const address = data.address || customer.address || '';
    const city = data.city || data.suburb || customer.city || customer.suburb || '';
    const state = data.state || customer.state || '';
    const postcode = data.postcode || customer.postcode || '';
    const country = data.country || customer.country || 'Australia';
    const shippingMethod = data.shippingMethod || 'normal';
    const paymentMethod = data.paymentMethod || 'crypto';
    const items = data.items || [];
    const subtotal = data.subtotal;
    const shippingCost = data.shippingCost;
    const total = data.total;

    // Server-side verification of payment method and order totals
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    const calculatedShipping = shippingMethod === 'normal' ? 20 : 70;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    if (calculatedSubtotal < 100) {
      return NextResponse.json({ error: 'Minimum order amount is $100 AUD.' }, { status: 400 });
    }

    if (calculatedTotal < 100 && paymentMethod === 'payid') {
      return NextResponse.json({ error: 'PayID is only available for orders of $100 AUD or more.' }, { status: 400 });
    }
    if (calculatedTotal < 200 && paymentMethod === 'bank_transfer') {
      return NextResponse.json({ error: 'Bank Transfer is only available for orders above $200 AUD.' }, { status: 400 });
    }

    const orderId = `RA-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullCustomerName = `${firstName} ${lastName}`.trim();
    const fullAddress = `${address}, ${city}, ${state} ${postcode}, ${country || 'Australia'}`;
    const itemsSummary = items.map((item: any) => `${item.qty}x ${item.name} (${item.variant}) - $${(item.price * item.qty).toFixed(2)} AUD`).join('\n');

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
Order Number: #${orderId}
----------------------------
Items:
${itemsSummary}

Subtotal: $${(typeof subtotal === 'number' ? subtotal : calculatedSubtotal).toFixed(2)} AUD
Shipping (${shippingMethod === 'normal' ? 'Standard' : 'Priority'}): $${(typeof shippingCost === 'number' ? shippingCost : calculatedShipping).toFixed(2)} AUD
Total: $${(typeof total === 'number' ? total : calculatedTotal).toFixed(2)} AUD

Customer Details:
----------------------------
Name: ${fullCustomerName}
Email: ${email}
Phone: ${phone}
Address: ${fullAddress}

Payment Method: ${paymentMethodLabel}
    `;

    let paymentInstructions = '';
    if (paymentMethod === 'crypto') {
      paymentInstructions = `You have selected Cryptocurrency. We will contact you manually with the transfer details shortly. (Crypto is our most preferred option with no delay in confirmation and processing).`;
    } else if (paymentMethod === 'payid') {
      paymentInstructions = `You have selected PayID. Our team will contact you shortly with the PayID transfer details to complete your payment.`;
    } else {
      paymentInstructions = `We will contact you manually with the payment details for your chosen payment method (${paymentMethodLabel}) shortly.`;
    }

    const clientEmailText = `
Hi ${firstName},

Thank you for your order with RetaAustralia.

We have successfully received your order #${orderId}.

${paymentInstructions}

Please note that your order will be processed and shipped once your payment has cleared on our end. Once cleared, we will process and ship your order, and your tracking number will be emailed to you.

${orderDetails}

Best regards,
RetaAustralia Team
    `;

    const adminEmailText = `
New Order Received: #${orderId} (${paymentMethodLabel})

${orderDetails}
    `;

    // Only attempt to send real emails if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      try {
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
          subject: `New Order #${orderId} from ${fullCustomerName} (${paymentMethodLabel})`,
          text: adminEmailText,
        });

        // Send to Client
        await transporter.sendMail({
          from: `"RetaAustralia" <${smtpUser}>`,
          to: email,
          subject: `Your Order Confirmation #${orderId} - RetaAustralia`,
          text: clientEmailText,
        });
        
        console.log('Checkout emails sent successfully.');
      } catch (emailErr) {
        console.error('Failed to send email notifications:', emailErr);
      }
    } else {
      console.log('No SMTP configuration found. Order logged locally:');
      console.log('--- ADMIN EMAIL ---');
      console.log(adminEmailText);
      console.log('--- CLIENT EMAIL ---');
      console.log(clientEmailText);
    }

    return NextResponse.json({ 
      success: true, 
      orderId,
      paymentMethod,
      total: calculatedTotal,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}

