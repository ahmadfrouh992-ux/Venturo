const Stripe = require("stripe");

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      ok: false,
      error: "STRIPE_SECRET_KEY is not configured",
    });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({
      ok: false,
      error: "STRIPE_WEBHOOK_SECRET is not configured",
    });
  }

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      ok: false,
      error: "Missing Stripe signature",
    });
  }

  let event;

  // =====================================================
  // VERIFY STRIPE WEBHOOK
  // =====================================================

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
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
      error: "Invalid webhook signature",
    });
  }

  // =====================================================
  // HANDLE STRIPE EVENTS
  // =====================================================

  try {
    switch (event.type) {

      // -------------------------------------------------
      // SUBSCRIPTION CREATED
      // -------------------------------------------------

      case "customer.subscription.created": {

        const subscription = event.data.object;

        const customerId =
          subscription.customer;

        const price =
          subscription.items?.data?.[0]?.price;

        const priceId =
          price?.id || null;

        const amount =
          price?.unit_amount || null;

        let plan = "unknown";

        if (
          priceId ===
          "price_1UA7GJHg87qsiCn6mw1HHWNw"
        ) {
          plan = "pro";
        }

        if (
          priceId ===
          "price_1UA7ZgHg87qsiCn6MJOgHlgW"
        ) {
          plan = "business";
        }

        console.log(
          "VEXALUNO SUBSCRIPTION CREATED",
          {
            customerId,
            priceId,
            amount,
            plan,
            status:
              subscription.status,
          }
        );

        break;
      }

      // -------------------------------------------------
      // SUBSCRIPTION UPDATED
      // -------------------------------------------------

      case "customer.subscription.updated": {

        const subscription = event.data.object;

        const customerId =
          subscription.customer;

        const price =
          subscription.items?.data?.[0]?.price;

        const priceId =
          price?.id || null;

        const amount =
          price?.unit_amount || null;

        let plan = "unknown";

        if (
          priceId ===
          "price_1UA7GJHg87qsiCn6mw1HHWNw"
        ) {
          plan = "pro";
        }

        if (
          priceId ===
          "price_1UA7ZgHg87qsiCn6MJOgHlgW"
        ) {
          plan = "business";
        }

        console.log(
          "VEXALUNO SUBSCRIPTION UPDATED",
          {
            customerId,
            priceId,
            amount,
            plan,
            status:
              subscription.status,
          }
        );

        break;
      }

      // -------------------------------------------------
      // SUBSCRIPTION CANCELLED
      // -------------------------------------------------

      case "customer.subscription.deleted": {

        const subscription = event.data.object;

        const customerId =
          subscription.customer;

        const price =
          subscription.items?.data?.[0]?.price;

        const priceId =
          price?.id || null;

        console.log(
          "VEXALUNO SUBSCRIPTION CANCELLED",
          {
            customerId,
            priceId,
            plan: "cancelled",
          }
        );

        break;
      }

      // -------------------------------------------------
      // CHECKOUT COMPLETED
      // -------------------------------------------------

      case "checkout.session.completed": {

        const session =
          event.data.object;

        console.log(
          "VEXALUNO CHECKOUT COMPLETED",
          {
            sessionId: session.id,
            customerId:
              session.customer || null,
            subscriptionId:
              session.subscription || null,
            mode:
              session.mode || null,
            paymentStatus:
              session.payment_status || null,
          }
        );

        break;
      }

      // -------------------------------------------------
      // OTHER EVENTS
      // -------------------------------------------------

      default:

        console.log(
          "Unhandled Stripe event:",
          event.type
        );
    }

    // ---------------------------------------------------
    // SUCCESS
    // ---------------------------------------------------

    return res.status(200).json({
      ok: true,
      received: true,
      event: event.type,
    });

  } catch (error) {

    console.error(
      "Vexaluno webhook processing error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error.message ||
        "Webhook processing error",
    });
  }
};
