export default async function handler(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method === "GET") {
    return new Response(
      JSON.stringify({
        ok: true,
        service: "Venturo Recommendation API",
        status: "running",
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    let body = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

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
          "Create social media posts, product descriptions and marketing content for small businesses using AI tools.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High",
      },
      {
        title: "Digital Products",
        description:
          "Create and sell ebooks, templates, guides, checklists and other downloadable digital products.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High",
      },
      {
        title: "Local Business Marketing",
        description:
          "Help local businesses improve their online presence, social media content and customer communication.",
        budget: "£50–£200",
        difficulty: "Medium",
        potential: "High",
      },
      {
        title: "Print-on-Demand Store",
        description:
          "Create designs for shirts, hoodies, mugs and other products without keeping physical inventory.",
        budget: "£0–£150",
        difficulty: "Medium",
        potential: "Medium",
      },
      {
        title: "Online Consulting Service",
        description:
          "Turn a useful skill or area of knowledge into a simple online consulting service.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "High",
      },
      {
        title: "Affiliate Marketing",
        description:
          "Build useful content around products or services and earn commissions from qualifying referrals.",
        budget: "£0–£100",
        difficulty: "Medium",
        potential: "Medium",
      },
      {
        title: "Online Course",
        description:
          "Package useful knowledge into a beginner-friendly online course and sell access digitally.",
        budget: "£0–£200",
        difficulty: "Medium",
        potential: "High",
      },
      {
        title: "Freelance Services",
        description:
          "Offer writing, design, research, administration or other digital services to clients online.",
        budget: "£0–£100",
        difficulty: "Easy",
        potential: "High",
      },
    ];

    let results = recommendations;

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
          score,
        };
      });

      scored.sort((a, b) => b.score - a.score);

      results = scored.map(({ score, ...item }) => item);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        idea,
        budget,
        recommendations: results,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Venturo API error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        success: false,
        error: "Recommendation service error.",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
