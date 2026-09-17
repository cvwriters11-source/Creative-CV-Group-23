export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export async function initializePaystack(input: {
  email: string;
  amountZar: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return null;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountZar * 100),
      currency: "ZAR",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
  const json = (await response.json()) as {
    status: boolean;
    data?: { authorization_url: string; reference: string };
    message?: string;
  };
  if (!json.status || !json.data) {
    throw new Error(json.message ?? "Paystack initialization failed");
  }
  return json.data;
}

export async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return { configured: false, paid: false as const };
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const json = (await response.json()) as {
    status: boolean;
    data?: { status?: string; reference?: string };
    message?: string;
  };
  return {
    configured: true,
    paid: json.status && json.data?.status === "success",
    reference: json.data?.reference ?? reference,
    status: json.data?.status,
    message: json.message,
  };
}
