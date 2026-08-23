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

Create a practical, realistic business blueprint for the selected business.

ORIGINAL USER IDEA:
${idea}

SELECTED BUSINESS:
${businessToBuild}

AVAILABLE BUDGET:
${budget}

IMPORTANT:

- Focus specifically on the selected business.
- Assume the user is a beginner.
- Make the plan realistic for the available budget.
- Do not promise guaranteed profits.
- Use realistic revenue ranges.
- Consider competition and customer acquisition.
- Prefer low-cost tools.
- Give practical pricing examples.
- Make the first-customer strategy specific.
- Make the marketing strategy actionable.
- Make the 90-day plan practical.
- Give exactly 7 first steps.
- Give exactly 4 risks.
- Keep answers concise but useful.
- All scores must be numbers from 1 to 10.

The blueprint must include:

1. Overall business score.
2. Market demand score.
3. Profit potential score.
4. Competition score.
5. Ease of launch score.
6. Scalability score.
7. Target customers.
8. Main customer problem.
9. Business solution.
10. Startup cost.
11. Revenue model.
12. Recommended pricing.
13. Example monthly revenue.
14. How to get the first customer.
15. Competition analysis.
16. Marketing strategy.
17. Tools needed.
18. 90-day plan.
19. Why the business can work.
20. Best business model.
21. Exactly 7 first steps.
22. Exactly 4 key risks.
23. One recommended next action.

Return data matching the JSON schema exactly.
`;


      const startTime =
        Date.now();


      const response =
        await client.responses.create({

          model: "gpt-5.6-luna",

          input: prompt,

          max_output_tokens: 3000,

          text: {

            format: {

              type: "json_schema",

              name: "business_blueprint",

              strict: true,

              schema: {

                type: "object",

                additionalProperties: false,

                properties: {

                  businessName: {
                    type: "string"
                  },

                  summary: {
                    type: "string"
                  },

                  score: {
                    type: "number"
                  },

                  marketDemand: {
                    type: "number"
                  },

                  profitPotential: {
                    type: "number"
                  },

                  competitionScore: {
                    type: "number"
                  },

                  easeOfLaunch: {
                    type: "number"
                  },

                  scalability: {
                    type: "number"
                  },

                  targetCustomer: {
                    type: "string"
                  },

                  problem: {
                    type: "string"
                  },

                  solution: {
                    type: "string"
                  },

                  startupCost: {
                    type: "string"
                  },

                  revenueModel: {
                    type: "string"
                  },

                  recommendedPricing: {
                    type: "string"
                  },

                  expectedMonthlyRevenue: {
                    type: "string"
                  },

                  competition: {
                    type: "string"
                  },

                  growthPotential: {
                    type: "string"
                  },

                  bestBusinessModel: {
                    type: "string"
                  },

                  marketingStrategy: {
                    type: "string"
                  },

                  firstCustomerStrategy: {
                    type: "string"
                  },

                  toolsNeeded: {
                    type: "string"
                  },

                  ninetyDayPlan: {
                    type: "string"
                  },

                  whyItCanWork: {
                    type: "string"
                  },

                  firstSteps: {
                    type: "array",
                    items: {
                      type: "string"
                    },
                    minItems: 7,
                    maxItems: 7
                  },

                  risks: {
                    type: "array",
                    items: {
                      type: "string"
                    },
                    minItems: 4,
                    maxItems: 4
                  },

                  nextAction: {
                    type: "string"
                  }

                },

                required: [

                  "businessName",

                  "summary",

                  "score",

                  "marketDemand",

                  "profitPotential",

                  "competitionScore",

                  "easeOfLaunch",

                  "scalability",

                  "targetCustomer",

                  "problem",

                  "solution",

                  "startupCost",

                  "revenueModel",

                  "recommendedPricing",

                  "expectedMonthlyRevenue",

                  "competition",

                  "growthPotential",

                  "bestBusinessModel",

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
        `OpenAI BUILD response time: ${elapsedTime} ms`
      );


      const text =
        response.output_text || "";


      if (!text) {

        console.error(
          "Empty BUILD response:",
          response
        );

        return res.status(500).json({

          ok: false,

          success: false,

          error:
            "Empty AI business blueprint response."

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
    // FIND BUSINESS IDEAS
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


    const startTime =
      Date.now();


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
