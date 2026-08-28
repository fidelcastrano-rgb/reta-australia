/**
 * Bachs Payment Gateway Integration for Credit / Debit Card Processing
 */

const BACHS_API_URL = 'https://api.bachs.io/v1/checkout-sessions';

// Active live secret key for Bachs account
const ACTIVE_BACHS_SECRET_KEY = 'sk_live_c58e2ddb_ixgLAIRNj5sv0dXGH0ha9QnTc_qdKJtki7jKUsORrJs';

export function getBachsSecretKey(): string {
  const envKey = process.env.BACHS_SECRET_KEY?.trim();
  // Ensure the old key is never used even if cached in process.env
  if (!envKey || envKey.includes('fe657a53') || envKey === '') {
    return ACTIVE_BACHS_SECRET_KEY;
  }
  return envKey;
}

export interface BachsCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface CreateBachsSessionParams {
  customer: BachsCustomer;
  audAmount: number;
  orderRef: string;
  shippingMethod?: string;
  itemsSummary?: string;
  address?: string;
}

export interface BachsCheckoutResponse {
  checkout_id: string;
  status: string;
  amount: string;
  currency: string;
  reference: string;
  checkout_url: string;
  expires_at?: string;
}

// Convert AUD to USD at current typical exchange rate (~0.65)
export function convertAudToUsd(aud: number): number {
  const rate = 0.65;
  const usd = aud * rate;
  return Math.round(usd * 100) / 100;
}

/**
 * Creates a Bachs hosted credit card checkout session
 */
export async function createBachsCheckoutSession(
  params: CreateBachsSessionParams
): Promise<BachsCheckoutResponse> {
  const secretKey = getBachsSecretKey();
  
  if (!secretKey) {
    throw new Error('BACHS_SECRET_KEY is not configured.');
  }

  const usdAmount = convertAudToUsd(params.audAmount);
  const formattedUsdAmount = usdAmount.toFixed(2);

  // Derive base URL for redirects
  const appUrl = process.env.APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://reta-australia.com.au');
  const cleanAppUrl = appUrl.replace(/\/+$/, '');

  const payload = {
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone || undefined,
    },
    pricing: {
      amount: formattedUsdAmount,
      currency: 'USD',
    },
    success_url: `${cleanAppUrl}/checkout/success?order_ref=${encodeURIComponent(params.orderRef)}`,
    cancel_url: `${cleanAppUrl}/checkout`,
    meta: {
      store: 'Reta Australia',
      order_ref: params.orderRef,
      order_total_aud: `$${params.audAmount.toFixed(2)} AUD`,
      usd_converted: `$${formattedUsdAmount} USD`,
      customer_name: params.customer.name,
      customer_email: params.customer.email,
      customer_phone: params.customer.phone || 'N/A',
      delivery_address: params.address || 'N/A',
      items_summary: params.itemsSummary || 'N/A',
    },
  };

  const response = await fetch(BACHS_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || response.statusText || 'Failed to create Bachs checkout session';
    throw new Error(`Bachs Gateway Error: ${errorMsg}`);
  }

  if (!data.checkout_url) {
    throw new Error('Invalid response from Bachs Payment Gateway: Missing checkout_url.');
  }

  return {
    checkout_id: data.checkout_id,
    status: data.status,
    amount: data.amount,
    currency: data.currency,
    reference: data.reference,
    checkout_url: data.checkout_url,
    expires_at: data.expires_at,
  };
}
