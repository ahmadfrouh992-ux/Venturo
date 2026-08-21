export default function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Browser preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "Venturo Recommendation API",
      status: "running"
    });
  }

  // Recommendations require POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const body = req.body || {};

    const idea = String(
      body.idea ||
      body.query ||
      body.prompt ||
      body.businessIdea ||
      ""
    ).trim();

    const budget = String(
      body.budget ||
      body.maxBudget ||
      "Any budget"
    );

    const recommendations = [
      {
        title: "AI Content Service",
        description:
          "Create social media posts, product descriptions and marketing content for small businesses using AI tools.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Digital Products",
        description:
          "Create and sell ebooks, templates, planners, guides and other downloadable products online.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Local Business Marketing",
        description:
          "Help local businesses improve their social media, online presence and customer reach.",
        budget: "£50–£200",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Print-on-Demand Store",
        description:
          "Create designs for shirts, mugs, stickers and other products without keeping physical inventory.",
        budget: "£50–£200",
        difficulty: "Easy",
        potential: "Medium"
      },
      {
        title: "Online Consulting Service",
        description:
          "Turn a useful skill into a simple online service and sell it directly to customers.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Affiliate Marketing",
        description:
          "Build useful content around a specific niche and earn commissions by recommending relevant products and services.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "Medium"
      }
    ];

    let results = recommendations;

    // Match recommendations to the user's idea
    if (idea.length > 0) {
      const keywords = idea
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2);

      const scored = recommendations.map((item) => {
        const text = (
          item.title +
          " " +
          item.description +
          " " +
          item.budget
        ).toLowerCase();

        let score = 0;

        keywords.forEach((keyword) => {
          if (text.includes(keyword)) {
            score += 1;
          }
        });

        return {
          ...item,
          score
        };
      });

      scored.sort((a, b) => b.score - a.score);

      results = scored.map(({ score, ...item }) => item);
    }

    return res.status(200).json({
      ok: true,
      success: true,
      idea: idea,
      budget: budget,
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
