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

const PRIMARY_BACHS_KEY = 'sk_live_c088fe9f_CNxd5NjpLKcKhpeyjVQ8KeehkGij3qY3R1saFmFdo4g';
const BACKUP_BACHS_KEY = 'sk_live_af315513_UAL3cnI5yHxg_AheFOm1FCE64PVCK7GLgvqP5Ep2OXU';

/**
 * Gets the active Bachs secret keys to attempt in order of priority.
 */
export function getBachsApiKeys(): string[] {
  const envKey = (process.env.BACHS_SECRET_KEY || process.env.BACHS_API_KEY || '').trim();
  const keys: string[] = [];

  if (envKey && envKey !== PRIMARY_BACHS_KEY && envKey !== BACKUP_BACHS_KEY) {
    keys.push(envKey);
  }
  keys.push(PRIMARY_BACHS_KEY);
  keys.push(BACKUP_BACHS_KEY);

  return Array.from(new Set(keys.filter(Boolean)));
}

/**
 * Resolves the Bachs API Base URL depending on environment and key prefix.
 */
export function getBachsBaseUrl(): string {
  if (process.env.BACHS_API_URL) {
    return process.env.BACHS_API_URL.replace(/\/$/, '');
  }

  const primaryKey = getBachsApiKeys()[0] || '';
  if (primaryKey.startsWith('sk_sandbox_') || primaryKey.startsWith('sk_test_')) {
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
  const apiKeys = getBachsApiKeys();

  if (apiKeys.length === 0) {
    throw new Error(
      'Credit card payment gateway is not configured. Please add your active secret key in settings / environment variables.'
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
  const successUrl = `${cleanOrigin}/checkout/success?order_ref=${orderId}&payment=card`;
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

  let lastErrorMsg = 'Failed to establish secure payment gateway connection.';

  // Attempt with configured keys in order (e.g. user key first, then verified active key)
  for (const key of apiKeys) {
    try {
      const response = await fetch(`${baseUrl}/v1/checkout-sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok && responseData.checkout_url) {
        return responseData as BachsCheckoutResult;
      }

      lastErrorMsg = responseData.detail || responseData.message || `Gateway returned status ${response.status}`;
      console.warn(`Card gateway session attempt with key ${key.slice(0, 12)}... failed:`, lastErrorMsg);
    } catch (err: any) {
      lastErrorMsg = err.message || 'Network error communicating with payment gateway.';
      console.warn(`Card gateway network attempt failed:`, lastErrorMsg);
    }
  }

  throw new Error(`Credit card checkout error: ${lastErrorMsg}`);
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
