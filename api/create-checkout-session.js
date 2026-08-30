export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        ok: false,
        error: "Stripe secret key is not configured."
      });
    }

    const params = new URLSearchParams();

    params.append(
      "line_items[0][price]",
      "price_1U9xpEQdu5hbkbDzDQB1IRrW"
    );

    params.append(
      "line_items[0][quantity]",
      "1"
    );

    params.append(
      "mode",
      "subscription"
    );

    params.append(
      "success_url",
      "https://www.vexaluno.com/?payment=success&session_id={CHECKOUT_SESSION_ID}"
    );

    params.append(
      "cancel_url",
      "https://www.vexaluno.com/pricing?payment=cancelled"
    );

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe error:", data);

      return res.status(response.status).json({
        ok: false,
        error:
          data?.error?.message ||
          "Unable to create Stripe checkout session."
      });
    }

    return res.status(200).json({
      ok: true,
      url: data.url,
      sessionId: data.id
    });

  } catch (error) {
    console.error("Checkout error:", error);

    return res.status(500).json({
      ok: false,
      error:
        error?.message ||
        "Stripe checkout error."
    });
  }
}
