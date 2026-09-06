import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createBachsCheckoutSession } from '@/lib/bachs';

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
    if (paymentMethod === 'credit_card') {
      paymentMethodLabel = 'Credit / Debit Card (Bachs Secure Checkout)';
    } else if (paymentMethod === 'payid') {
      paymentMethodLabel = 'PayID';
    } else if (paymentMethod === 'crypto') {
      paymentMethodLabel = 'Cryptocurrency (USDT/BTC/LTC - Preferred)';
    }

    // If Credit Card via Bachs was selected, attempt to create the hosted checkout session
    let checkoutUrl: string | undefined = undefined;
    let cardGatewayNotice: string | undefined = undefined;

    if (paymentMethod === 'credit_card') {
      try {
        const origin = req.headers.get('origin') || req.headers.get('referer') || process.env.APP_URL || 'https://reta-australia.com.au';
        const bachsSession = await createBachsCheckoutSession({
          orderId,
          audTotal: calculatedTotal,
          customer: {
            email,
            name: fullCustomerName,
            phone_number: phone,
          },
          shippingMethod: shippingMethod === 'express' ? 'Priority Express ($70 AUD)' : 'Standard Express ($20 AUD)',
          shippingAddress: fullAddress,
          origin,
          items,
        });

        if (bachsSession && bachsSession.checkout_url) {
          checkoutUrl = bachsSession.checkout_url;
        }
      } catch (gatewayErr: any) {
        console.warn(`[Bachs Payment Gateway] Notice for Order #${orderId}: ${gatewayErr.message}`);
        cardGatewayNotice = gatewayErr.message || 'Credit card gateway synchronization in progress';
      }
    }

    const orderDetails = `
Order Number: #${orderId}
----------------------------
Items:
${itemsSummary}

Subtotal: $${subtotal.toFixed(2)} AUD
Shipping (${shippingMethod === 'normal' ? 'Standard' : 'Priority'}): $${shippingCost.toFixed(2)} AUD
Total: $${total.toFixed(2)} AUD

Customer Details:
----------------------------
Name: ${fullCustomerName}
Email: ${email}
Phone: ${phone}
Address: ${fullAddress}

Payment Method: ${paymentMethodLabel}${cardGatewayNotice ? `\nGateway Note: ${cardGatewayNotice}` : ''}
    `;

    let paymentInstructions = '';
    if (paymentMethod === 'credit_card') {
      if (checkoutUrl) {
        paymentInstructions = `You selected Credit / Debit Card payment. Your transaction was initiated via Bachs Secure Hosted Checkout (${checkoutUrl}). As soon as payment confirmation is completed, your order will be prepared for immediate dispatch.`;
      } else {
        paymentInstructions = `You selected Credit / Debit Card payment. Your order #${orderId} has been successfully recorded. Our card processing gateway is undergoing a brief credential synchronization with Bachs. Our dispatch desk will send a direct card payment link or invoice to your email and phone shortly so you can finalize payment.`;
      }
    } else if (paymentMethod === 'crypto') {
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
      checkoutUrl,
      cardGatewayNotice,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}

