export interface BachsCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface CreateBachsCheckoutParams {
  customer: BachsCustomer;
  audAmount: number;
  orderRef: string;
  shippingMethod: string;
  itemsSummary: string;
  address: string;
  appUrl?: string;
}

export interface BachsCheckoutResponse {
  checkout_id: string;
  mode: string;
  status: string;
  amount: string;
  currency: string;
  reference: string;
  checkout_url: string;
  expires_at?: string;
  created_at?: string;
}

const BACHS_API_BASE = 'https://api.bachs.io/v1';
const DEFAULT_SECRET_KEY = 'sk_live_fe657a53_NMWEM6yPRnPGgxr0aGg3BW5lV9EPea56Czp33XQ9nzs';
const AUD_TO_USD_RATE = 0.65; // Estimated AUD to USD conversion rate for card checkout

export function convertAudToUsd(audAmount: number): number {
  return Math.max(5, Math.round(audAmount * AUD_TO_USD_RATE * 100) / 100);
}

export async function createBachsCheckoutSession(
  params: CreateBachsCheckoutParams
): Promise<BachsCheckoutResponse> {
  const secretKey = process.env.BACHS_SECRET_KEY || DEFAULT_SECRET_KEY;
  const baseUrl = (params.appUrl || process.env.APP_URL || 'https://reta-australia.com.au').replace(/\/$/, '');
  
  const usdAmount = convertAudToUsd(params.audAmount);

  const payload = {
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone || undefined,
    },
    pricing: {
      amount: usdAmount.toFixed(2),
      currency: 'USD',
    },
    success_url: `${baseUrl}/checkout/success?order_ref=${encodeURIComponent(params.orderRef)}`,
    cancel_url: `${baseUrl}/checkout`,
    meta: {
      store: 'Reta Australia',
      order_ref: params.orderRef,
      order_total_aud: `$${params.audAmount.toFixed(2)} AUD`,
      usd_converted: `$${usdAmount.toFixed(2)} USD`,
      shipping_method: params.shippingMethod,
      customer_name: params.customer.name,
      customer_email: params.customer.email,
      customer_phone: params.customer.phone || 'N/A',
      delivery_address: params.address,
      items_summary: params.itemsSummary,
    },
  };

  const response = await fetch(`${BACHS_API_BASE}/checkout-sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey.trim()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const resText = await response.text();
  let data: any;
  try {
    data = JSON.parse(resText);
  } catch (e) {
    throw new Error(`Failed to parse Bachs API response: ${resText}`);
  }

  if (!response.ok) {
    const errorMsg = data.detail || data.message || `Bachs Gateway error (${response.status})`;
    throw new Error(errorMsg);
  }

  return data as BachsCheckoutResponse;
}

export async function getBachsCheckoutSession(checkoutId: string): Promise<any> {
  const secretKey = process.env.BACHS_SECRET_KEY || DEFAULT_SECRET_KEY;
  const response = await fetch(`${BACHS_API_BASE}/checkout-sessions/${checkoutId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${secretKey.trim()}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const resText = await response.text();
    throw new Error(`Failed to fetch Bachs session: ${resText}`);
  }

  return response.json();
}
