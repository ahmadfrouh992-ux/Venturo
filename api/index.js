export default async function handler(req, res) {
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
  res.setHeader("Content-Type", "application/json");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      success: true,
      service: "Venturo Recommendation API",
      status: "running"
    });
  }

  // Only POST for recommendations
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      success: false,
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
    ).trim();

    const recommendations = [
      {
        title: "AI Content Service",
        description:
          "Create social media posts, product descriptions and useful content for businesses.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Digital Products",
        description:
          "Create and sell ebooks, templates, guides and downloadable resources.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
      },
      {
        title: "Local Business Marketing",
        description:
          "Help local businesses improve their online presence, content and customer reach.",
        budget: "£50–£200",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Print-on-Demand Store",
        description:
          "Create designs for shirts, hoodies, mugs and other products without holding inventory.",
        budget: "£0–£150",
        difficulty: "Medium",
        potential: "Medium"
      },
      {
        title: "Online Consulting Service",
        description:
          "Turn a useful skill or area of knowledge into a simple online consulting service.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Affiliate Marketing",
        description:
          "Build useful content around products and earn commissions from qualified sales.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "Medium"
      },
      {
        title: "Online Course",
        description:
          "Package useful knowledge into a beginner-friendly online course.",
        budget: "£0–£200",
        difficulty: "Medium",
        potential: "High"
      },
      {
        title: "Freelance Services",
        description:
          "Offer writing, design, research, administration or other useful services online.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High"
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
          item.budget +
          " " +
          item.difficulty +
          " " +
          item.potential
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
