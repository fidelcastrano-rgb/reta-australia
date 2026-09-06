import crypto from 'crypto';

interface BachsCustomer {
  email: string;
  name: string;
  phone_number?: string | null;
}

interface CreateCheckoutParams {
  orderId: string;
  audTotal: number;
  customer: BachsCustomer;
  shippingMethod: string;
  shippingAddress: string;
  origin: string;
  items: Array<{
    name: string;
    variant: string;
    qty: number;
    price: number;
  }>;
}

export interface BachsCheckoutResult {
  checkout_id: string;
  checkout_url: string;
  status: string;
  expires_at?: string;
  created_at?: string;
  reference?: string;
}

const DEFAULT_BACHS_KEY = 'sk_live_af315513_UAL3cnI5yHxg_AheFOm1FCE64PVCK7GLgvqP5Ep2OXU';

// Ensure process.env has the active key (overriding any stale/suspended container env keys)
if (typeof process !== 'undefined' && process.env) {
  if (!process.env.BACHS_SECRET_KEY || process.env.BACHS_SECRET_KEY.includes('f1121ab8')) {
    process.env.BACHS_SECRET_KEY = DEFAULT_BACHS_KEY;
  }
}

/**
 * Gets the active Bachs secret key.
 */
export function getBachsApiKey(): string {
  const envKey = process.env.BACHS_SECRET_KEY || process.env.BACHS_API_KEY;
  if (envKey && envKey.trim() && !envKey.includes('f1121ab8')) {
    return envKey.trim();
  }
  return DEFAULT_BACHS_KEY.trim();
}

/**
 * Resolves the Bachs API Base URL depending on environment and key prefix.
 */
export function getBachsBaseUrl(): string {
  if (process.env.BACHS_API_URL) {
    return process.env.BACHS_API_URL.replace(/\/$/, '');
  }

  const apiKey = getBachsApiKey();
  if (apiKey.startsWith('sk_sandbox_') || apiKey.startsWith('sk_test_')) {
    return 'https://sandbox-api.bachs.io';
  }
  return 'https://api.bachs.io';
}

/**
 * Fetches the current AUD -> USD exchange rate with a resilient fallback.
 */
export async function getAudToUsdRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/AUD', {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.USD && typeof data.rates.USD === 'number') {
        return data.rates.USD;
      }
    }
  } catch {
    // Non-blocking fallback
  }
  return 0.65; // Conservative fallback mid-market rate
}

/**
 * Creates a hosted Checkout Session via Bachs REST API.
 * Follows documentation: https://docs.bachs.io/guides/checkout/checkout-sessions
 */
export async function createBachsCheckoutSession({
  orderId,
  audTotal,
  customer,
  shippingMethod,
  shippingAddress,
  origin,
  items,
}: CreateCheckoutParams): Promise<BachsCheckoutResult> {
  const apiKey = getBachsApiKey();

  if (!apiKey) {
    throw new Error(
      'Bachs secret key (BACHS_SECRET_KEY) is not configured. Please add your secret key in Settings / environment variables.'
    );
  }

  const baseUrl = getBachsBaseUrl();
  const rate = await getAudToUsdRate();
  const usdAmount = (audTotal * rate).toFixed(2);

  // Clean phone number (format with international prefix if valid)
  let formattedPhone: string | null = null;
  if (customer.phone_number) {
    const cleaned = customer.phone_number.trim();
    if (cleaned.startsWith('+')) {
      formattedPhone = cleaned;
    } else if (cleaned.startsWith('0')) {
      formattedPhone = `+61${cleaned.slice(1)}`;
    } else {
      formattedPhone = `+61${cleaned}`;
    }
  }

  const cleanOrigin = (origin || process.env.APP_URL || 'https://reta-australia.com.au').replace(/\/$/, '');
  const successUrl = `${cleanOrigin}/checkout/success?order_ref=${orderId}&payment=bachs`;
  const cancelUrl = `${cleanOrigin}/checkout?canceled=true`;

  const itemSummary = items
    .slice(0, 5)
    .map(i => `${i.qty}x ${i.name}`)
    .join(', ');

  const payload = {
    customer: {
      email: customer.email,
      name: customer.name,
      ...(formattedPhone ? { phone_number: formattedPhone } : {})
    },
    pricing: {
      currency: 'USD',
      amount: usdAmount
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    reference: orderId,
    metadata: {
      order_id: orderId,
      amount_aud: audTotal.toFixed(2),
      usd_rate: rate.toString(),
      shipping_method: shippingMethod,
      shipping_address: shippingAddress.slice(0, 200),
      items_summary: itemSummary.slice(0, 200)
    }
  };

  const response = await fetch(`${baseUrl}/v1/checkout-sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg =
      responseData.detail ||
      responseData.message ||
      responseData.error_code ||
      `Bachs API error (${response.status})`;
    if (response.status === 401 || errorMsg.toLowerCase().includes('invalid api key')) {
      errorMsg = 'Invalid or suspended Bachs API key. Please check your active secret key in settings / environment variables.';
    }
    throw new Error(`Credit card checkout error: ${errorMsg}`);
  }

  if (!responseData.checkout_url) {
    throw new Error('Bachs checkout session was created but no checkout URL was returned.');
  }

  return responseData as BachsCheckoutResult;
}

/**
 * Verifies a webhook signature sent by Bachs (X-Bachs-Signature).
 * Signature is HMAC-SHA256 of `${timestamp}.${rawBody}`.
 */
export function verifyBachsWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string
): boolean {
  try {
    const payload = `${timestamp}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}
