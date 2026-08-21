const CATALOG = [
  {
    title: "Digital Templates",
    category: "Digital Products",
    difficulty: "Easy",
    budget: "£0–£50",
    score: 94,
    reason: "Low startup cost and can be sold repeatedly without physical inventory.",
    steps: ["Choose one narrow customer problem", "Create a polished template pack", "Publish a simple sales page", "Test three price points"]
  },
  {
    title: "AI-Powered Business Research",
    category: "AI Services",
    difficulty: "Medium",
    budget: "£20–£100",
    score: 91,
    reason: "Businesses pay for faster market research, competitor analysis, and idea validation.",
    steps: ["Pick one business niche", "Create a repeatable research workflow", "Build a sample report", "Sell the service to the first 10 prospects"]
  },
  {
    title: "Local Lead Generation",
    category: "Services",
    difficulty: "Medium",
    budget: "£50–£200",
    score: 89,
    reason: "Local companies can benefit from a steady flow of qualified enquiries.",
    steps: ["Choose one local industry", "Build a focused landing page", "Create a lead capture system", "Offer qualified leads to businesses"]
  },
  {
    title: "Print-on-Demand Brand",
    category: "E-commerce",
    difficulty: "Easy",
    budget: "£0–£100",
    score: 86,
    reason: "You can test designs without holding inventory or paying for a large initial production run.",
    steps: ["Choose a clear audience", "Create 10–20 original designs", "Open a storefront", "Test the best designs with small campaigns"]
  },
  {
    title: "Micro SaaS Tool",
    category: "Software",
    difficulty: "Hard",
    budget: "£50–£500",
    score: 84,
    reason: "A small tool solving one painful problem can create recurring revenue.",
    steps: ["Interview potential users", "Define one core feature", "Build a minimal version", "Charge early customers and iterate"]
  }
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let input = {};
  if (req.method === "GET") {
    input = req.query || {};
  } else {
    try {
      input = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const query = normalize(input.query || input.goal || "");
  const budget = normalize(input.budget || "");

  let results = [...CATALOG];

  if (query) {
    const words = query.split(/\s+/).filter(Boolean);
    results.sort((a, b) => {
      const score = item =>
        words.reduce((total, word) => {
          const haystack = normalize(`${item.title} ${item.category} ${item.reason}`);
          return total + (haystack.includes(word) ? 15 : 0);
        }, 0);
      return (score(b) + b.score / 100) - (score(a) + a.score / 100);
    });
  }

  if (budget.includes("low") || budget.includes("0")) {
    results.sort((a, b) => (a.budget.includes("£0") ? -1 : 1) - (b.budget.includes("£0") ? -1 : 1));
  }

  return res.status(200).json({
    ok: true,
    query: query || null,
    recommendations: results.slice(0, 5)
  });
};