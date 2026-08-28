import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createBachsCheckoutSession, convertAudToUsd } from '@/lib/bachs';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      postcode, 
      country, 
      shippingMethod, 
      paymentMethod, 
      items, 
      subtotal, 
      shippingCost, 
      total 
    } = data;

    // Server-side verification of payment method and order totals
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    const calculatedShipping = shippingMethod === 'normal' ? 20 : 70;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    if (calculatedSubtotal < 150) {
      return NextResponse.json({ error: 'Minimum order amount is $150 AUD.' }, { status: 400 });
    }

    if (calculatedTotal < 100 && paymentMethod !== 'crypto') {
      return NextResponse.json({ error: 'Orders below $100 AUD can only be paid via Crypto.' }, { status: 400 });
    }
    if (calculatedTotal < 100 && paymentMethod === 'credit_card') {
      return NextResponse.json({ error: 'Credit Card is only available for orders of $100 AUD or more.' }, { status: 400 });
    }
    if (calculatedTotal < 200 && paymentMethod === 'bank_transfer') {
      return NextResponse.json({ error: 'Bank Transfer is only available for orders above $200 AUD.' }, { status: 400 });
    }

    const orderId = `RA-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullCustomerName = `${firstName} ${lastName}`.trim();
    const fullAddress = `${address}, ${city}, ${state} ${postcode}, ${country || 'Australia'}`;
    const itemsSummary = items.map((item: any) => `${item.qty}x ${item.name} (${item.variant}) - $${(item.price * item.qty).toFixed(2)} AUD`).join('\n');

    let bachsCheckoutUrl: string | null = null;
    let bachsCheckoutId: string | null = null;
    let bachsReference: string | null = null;
    let usdAmount: number | null = null;

    // If Credit Card is selected, initiate the Bachs payment gateway session
    if (paymentMethod === 'credit_card') {
      try {
        usdAmount = convertAudToUsd(calculatedTotal);
        const bachsSession = await createBachsCheckoutSession({
          customer: {
            name: fullCustomerName,
            email: email,
            phone: phone || undefined,
          },
          audAmount: calculatedTotal,
          orderRef: orderId,
          shippingMethod: shippingMethod === 'normal' ? 'Standard Express ($20.00 AUD)' : 'Priority Express ($70.00 AUD)',
          itemsSummary: items.map((i: any) => `${i.qty}x ${i.name} (${i.variant})`).join(', '),
          address: fullAddress,
        });

        bachsCheckoutUrl = bachsSession.checkout_url;
        bachsCheckoutId = bachsSession.checkout_id;
        bachsReference = bachsSession.reference;
      } catch (err: any) {
        console.error('Bachs API gateway error:', err);
        return NextResponse.json({ 
          error: `Credit Card Gateway Error: ${err.message || 'Unable to generate credit card payment session. Please try again or contact support.'}` 
        }, { status: 502 });
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'order@reta-australia.com.au';
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let paymentMethodLabel = 'Bank Transfer';
    if (paymentMethod === 'payid') {
      paymentMethodLabel = 'PayID';
    } else if (paymentMethod === 'credit_card') {
      paymentMethodLabel = 'Credit Card (Bachs Gateway)';
    } else if (paymentMethod === 'crypto') {
      paymentMethodLabel = 'Cryptocurrency (USDT/BTC/LTC - Preferred)';
    }

    const orderDetails = `
Order Number: #${orderId}
----------------------------
Items:
${itemsSummary}

Subtotal: $${subtotal.toFixed(2)} AUD
Shipping (${shippingMethod === 'normal' ? 'Standard' : 'Priority'}): $${shippingCost.toFixed(2)} AUD
Total: $${total.toFixed(2)} AUD ${usdAmount ? `(approx $${usdAmount.toFixed(2)} USD)` : ''}

Customer Details:
----------------------------
Name: ${fullCustomerName}
Email: ${email}
Phone: ${phone}
Address: ${fullAddress}

Payment Method: ${paymentMethodLabel}
${bachsCheckoutUrl ? `Credit Card Payment Portal Link: ${bachsCheckoutUrl}\nBachs Reference: ${bachsReference || 'N/A'}\nBachs Checkout ID: ${bachsCheckoutId || 'N/A'}` : ''}
    `;

    let paymentInstructions = '';
    if (paymentMethod === 'crypto') {
      paymentInstructions = `You have selected Cryptocurrency. We will contact you manually with the transfer details shortly. (Crypto is our most preferred option with no delay in confirmation and processing).`;
    } else if (paymentMethod === 'credit_card') {
      paymentInstructions = `You have selected Credit Card (Bachs Payment Gateway).

CREDIT CARD PAYMENT LINK:
Please click the secure link below to complete your payment by Credit/Debit Card:
👉 Pay Online Now: ${bachsCheckoutUrl}

Payment Details:
- Amount: $${total.toFixed(2)} AUD (~$${usdAmount?.toFixed(2)} USD)
- Reference: ${bachsReference || orderId}

Once your card payment is completed, your order will be packed and dispatched with next-day express delivery.`;
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
New Order Received: #${orderId}

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
      checkoutUrl: bachsCheckoutUrl,
      checkoutId: bachsCheckoutId,
      reference: bachsReference,
      usdAmount,
      total: calculatedTotal
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}
