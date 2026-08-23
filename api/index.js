import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

  const allowedOrigins = [
  "https://www.vexaluno.com",
  "https://vexaluno.com",
  "https://venturo-ai.vercel.app"
];

const requestOrigin = req.headers.origin;

if (allowedOrigins.includes(requestOrigin)) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    requestOrigin
  );
}

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
      service: "Vexaluno AI Business Builder",
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

  try {

    const body = req.body || {};

    const action = String(
      body.action || "recommend"
    ).trim();

    const idea = String(
      body.idea ||
      body.query ||
      body.prompt ||
      body.businessIdea ||
      ""
    ).trim();

    const selectedBusiness = String(
      body.selectedBusiness ||
      body.business ||
      ""
    ).trim();

    const budget = String(
      body.budget ||
      body.maxBudget ||
      "Any budget"
    ).trim();

    if (!idea) {
      return res.status(400).json({
        ok: false,
        success: false,
        error: "Please enter a business idea."
      });
    }

    // =====================================================
    // BUILD MY BUSINESS
    // =====================================================

    if (action === "build") {

      const businessToBuild =
        selectedBusiness || idea;

      const prompt = `
You are Vexaluno, a professional global AI business builder.

The user searched for a business idea and selected a specific business opportunity.

ORIGINAL USER IDEA:
${idea}

SELECTED BUSINESS:
${businessToBuild}

AVAILABLE BUDGET:
${budget}

Create a practical, realistic and detailed business blueprint
specifically for the SELECTED BUSINESS.

Do not give a generic analysis.
Focus on how the user could realistically start this business.

Return ONLY valid JSON using exactly this structure:

{
  "businessName": "name of the selected business",
  "summary": "short practical business summary",
  "score": 8,
  "targetCustomer": "ideal target customers",
  "startupCost": "realistic estimated startup cost",
  "revenueModel": "how the business makes money",
  "competition": "competition assessment",
  "growthPotential": "growth assessment",
  "bestBusinessModel": "best business model",
  "recommendedPricing": "recommended prices or pricing structure",
  "expectedMonthlyRevenue": "realistic potential monthly revenue range after gaining customers",
  "profitPotential": "realistic profit potential and main costs",
  "marketingStrategy": "practical strategy for getting customers",
  "firstCustomerStrategy": "specific strategy for getting the first customer",
  "toolsNeeded": "tools and platforms needed to start",
  "ninetyDayPlan": "practical plan for the first 90 days",
  "whyItCanWork": "short explanation of why this business could work",
  "firstSteps": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6",
    "Step 7"
  ],
  "risks": [
    "Risk 1",
    "Risk 2",
    "Risk 3",
    "Risk 4"
  ],
  "nextAction": "the single most important action the user should take next"
}

RULES:

- score must be a number from 1 to 10.
- Give exactly 7 first steps.
- Give exactly 4 risks.
- Keep everything realistic for the available budget.
- Do not recommend spending far beyond the user's budget.
- Do not promise guaranteed profits.
- Do not invent statistics.
- Revenue figures must be presented as realistic estimates or ranges, not guarantees.
- Consider competition and customer acquisition difficulty.
- Make the plan practical for a beginner.
- Prefer low-cost tools when the budget is low.
- Give specific pricing examples when appropriate.
- Explain the main costs when discussing profit.
- Make the marketing strategy actionable.
- Make the first customer strategy specific.
- Make the 90-day plan practical.
- Use clear English.
`;

      const startTime = Date.now();

const response =
  await client.responses.create({
    model: "gpt-5.6-luna",
    input: prompt,
    max_output_tokens: 2400,
    text: {
      format: {
        type: "json_schema",
        name: "business_blueprint",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            businessName: { type: "string" },
            summary: { type: "string" },
            score: { type: "number" },
            targetCustomer: { type: "string" },
            startupCost: { type: "string" },
            revenueModel: { type: "string" },
            competition: { type: "string" },
            growthPotential: { type: "string" },
            bestBusinessModel: { type: "string" },
            recommendedPricing: { type: "string" },
            expectedMonthlyRevenue: { type: "string" },
            profitPotential: { type: "string" },
            marketingStrategy: { type: "string" },
            firstCustomerStrategy: { type: "string" },
            toolsNeeded: { type: "string" },
            ninetyDayPlan: { type: "string" },
            whyItCanWork: { type: "string" },
            firstSteps: {
              type: "array",
              items: { type: "string" },
              minItems: 7,
              maxItems: 7
            },
            risks: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4
            },
            nextAction: { type: "string" }
          },
          required: [
            "businessName",
            "summary",
            "score",
            "targetCustomer",
            "startupCost",
            "revenueModel",
            "competition",
            "growthPotential",
            "bestBusinessModel",
            "recommendedPricing",
            "expectedMonthlyRevenue",
            "profitPotential",
            "marketingStrategy",
            "firstCustomerStrategy",
            "toolsNeeded",
            "ninetyDayPlan",
            "whyItCanWork",
            "firstSteps",
            "risks",
            "nextAction"
          ]
        }
      }
    }
  });

const elapsedTime =
  Date.now() - startTime;

console.log(
  `OpenAI response time: ${elapsedTime} ms`
);

      const text =
        response.output_text || "";

      if (!text) {
        return res.status(500).json({
          ok: false,
          success: false,
          error: "Empty AI response."
        });
      }

      let analysis;

      try {

        analysis =
          JSON.parse(text);

      } catch (error) {

        console.error(
          "Build JSON error:",
          text
        );

        return res.status(500).json({
          ok: false,
          success: false,
          error:
            "AI returned invalid business analysis."
        });

      }

      return res.status(200).json({
        ok: true,
        success: true,
        action: "build",
        idea,
        selectedBusiness:
          businessToBuild,
        budget,
        analysis
      });
    }

    // =====================================================
    // FIND IDEAS
    // =====================================================

    const prompt = `
You are Vexaluno, a professional global AI business builder.

The user wants to find realistic businesses.

USER IDEA:
${idea}

AVAILABLE BUDGET:
${budget}

Create exactly 8 practical business opportunities
related specifically to the user's request.

Every opportunity must be realistic for the available budget.

Return ONLY valid JSON using exactly this structure:

{
  "recommendations": [
    {
      "title": "Business idea title",
      "description": "Short practical description",
      "budget": "Estimated startup budget",
      "difficulty": "Easy",
      "potential": "High"
    }
  ]
}

RULES:

- Return exactly 8 recommendations.
- Make each recommendation different.
- Every recommendation must be related to the user's request.
- Respect the user's budget.
- Avoid generic unrelated businesses.
- Difficulty must be Easy, Medium, or Hard.
- Potential must be Low, Medium, or High.
- Do not promise guaranteed profits.
- Use realistic startup costs.
- Use clear English.
`;

    const startTime = Date.now();

const response =
  await client.responses.create({
    model: "gpt-5.6-luna",
    input: prompt,
    max_output_tokens: 1600
  });

const elapsedTime =
  Date.now() - startTime;

console.log(
  `OpenAI FIND IDEAS response time: ${elapsedTime} ms`
);

    const text =
      response.output_text || "";

    if (!text) {
      return res.status(500).json({
        ok: false,
        success: false,
        error: "Empty AI response."
      });
    }

    let aiResult;

    try {

      aiResult =
        JSON.parse(text);

    } catch (error) {

      console.error(
        "Recommendation JSON error:",
        text
      );

      return res.status(500).json({
        ok: false,
        success: false,
        error:
          "AI returned invalid recommendations."
      });

    }

    if (
      !aiResult ||
      !Array.isArray(
        aiResult.recommendations
      )
    ) {

      return res.status(500).json({
        ok: false,
        success: false,
        error:
          "Invalid recommendation response."
      });

    }

    return res.status(200).json({
      ok: true,
      success: true,
      action: "recommend",
      idea,
      budget,
      recommendations:
        aiResult.recommendations
    });

  } catch (error) {

    console.error(
      "Vexaluno AI error:",
      error
    );

    return res.status(500).json({
      ok: false,
      success: false,
      error:
        error?.message ||
        "Vexaluno AI service error."
    });
  }
}
