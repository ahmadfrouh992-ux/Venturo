const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      ok: false,
      error: "Missing Stripe signature"
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature error:",
      error.message
    );

    return res.status(400).json({
      ok: false,
      error: "Invalid webhook signature"
    });
  }

  try {
    const subscription = event.data.object;

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const customerId = subscription.customer;

        const priceId =
          subscription.items?.data?.[0]?.price?.id;

        const amount =
          subscription.items?.data?.[0]?.price?.unit_amount;

        let plan = "unknown";

        if (amount === 999) {
          plan = "pro";
        }

        if (amount === 2999) {
          plan = "business";
        }

        if (event.type === "customer.subscription.deleted") {
          plan = "cancelled";
        }

        console.log("Vexaluno subscription:", {
          event: event.type,
          customerId,
          priceId,
          plan
        });

        break;
      }

      default:
        console.log(
          "Unhandled Stripe event:",
          event.type
        );
    }

    return res.status(200).json({
      ok: true,
      received: true
    });

  } catch (error) {
    console.error(
      "Vexaluno webhook error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error.message ||
        "Webhook processing error"
    });
  }
};
