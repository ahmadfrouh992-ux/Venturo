export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      success: true,
      service: "Venturo Recommendation API",
      status: "running"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      success: false,
      error: "Method not allowed"
    });
  }

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
        "Create social media posts, product descriptions and marketing content for small businesses.",
      budget: "£0–£100",
      difficulty: "Easy",
      potential: "High"
    },
    {
      title: "Digital Products",
      description:
        "Create and sell ebooks, templates, guides and downloadable resources online.",
      budget: "£0–£100",
      difficulty: "Easy",
      potential: "High"
    },
    {
      title: "Local Business Marketing",
      description:
        "Help local businesses improve their online presence and reach more customers.",
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
        "Turn a useful skill into a simple online consulting service.",
      budget: "£0–£100",
      difficulty: "Medium",
      potential: "High"
    },
    {
      title: "Affiliate Marketing",
      description:
        "Create useful content and earn commissions from qualifying referrals.",
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
        "Offer writing, design, research or administration services online.",
      budget: "£0–£100",
      difficulty: "Easy",
      potential: "High"
    }
  ];

  return res.status(200).json({
    ok: true,
    success: true,
    idea,
    budget,
    recommendations
  });
}
