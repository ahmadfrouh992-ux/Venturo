export default function handler(req, res) {
  // Allow the browser to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST is needed for recommendations
  if (req.method !== "POST") {
    return res.status(200).json({
      ok: true,
      service: "Venturo Recommendation API",
      message: "Recommendation service is running."
    });
  }

  try {
    const body = req.body || {};

    const idea =
      body.idea ||
      body.query ||
      body.prompt ||
      body.businessIdea ||
      "";

    const budget =
      body.budget ||
      body.maxBudget ||
      "Any budget";

    const text = String(idea).toLowerCase();

    const recommendations = [
      {
        title: "AI Content Service",
        description:
          "Create social media posts, product descriptions and simple marketing content for small businesses using AI tools.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Digital Products",
        description:
          "Create and sell ebooks, templates, planners, guides or downloadable business resources online.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Local Business Marketing",
        description:
          "Help local businesses improve their Google presence, social media content and online visibility.",
        budget: "£50–£200",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Print-on-Demand Store",
        description:
          "Create designs for shirts, mugs, stickers and other products without holding physical inventory.",
        budget: "£50–£200",
        difficulty: "Easy",
        potential: "Medium"
      },
      {
        title: "Online Consulting Service",
        description:
          "Package a useful skill into a simple online service and sell it directly to customers.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "High"
      }
    ];

    // Simple relevance filtering
    let results = recommendations;

    if (text) {
      const keywords = text
        .split(/\s+/)
        .filter(word => word.length > 2);

      const scored = recommendations.map(item => {
        const combined =
          `${item.title} ${item.description}`.toLowerCase();

        let score = 0;

        for (const keyword of keywords) {
          if (combined.includes(keyword)) {
            score++;
          }
        }

        return { ...item, score };
      });

      scored.sort((a, b) => b.score - a.score);

      results = scored.map(({ score, ...item }) => item);
    }

    return res.status(200).json({
      ok: true,
      success: true,
      idea,
      budget,
      recommendations: results
    });
  } catch (error) {
    console.error("Venturo API error:", error);

    return res.status(500).json({
      ok: false,
      success: false,
      error: "Recommendation service error."
    });
  }
}
