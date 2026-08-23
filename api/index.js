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

Create a realistic and practical business blueprint.

ORIGINAL USER IDEA:
${idea}

SELECTED BUSINESS:
${businessToBuild}

AVAILABLE BUDGET:
${budget}

The user is a beginner.

Create a useful business plan that includes:

- realistic market demand
- profit potential
- competition
- ease of launch
- scalability
- target customers
- customer problem
- solution
- why the business can work
- best business model
- startup costs
- revenue model
- realistic pricing
- realistic monthly revenue examples
- first customer strategy
- competition strategy
- marketing strategy
- tools needed
- practical 90-day plan
- exactly 7 first steps
- exactly 4 key risks
- one clear next action

IMPORTANT:

Do not promise guaranteed profits.

Use realistic estimates.

Respect the available budget.

If the budget is "Any budget", choose a sensible lean starting budget.

Assume the business operates initially in London unless the user's idea clearly requires another location.

Keep the answers concise but useful.

All scores must be numbers from 1 to 10.
`;

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

                  whyItCanWork: {
                    type: "string"
                  },

                  bestBusinessModel: {
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

                  firstCustomerStrategy: {
                    type: "string"
                  },

                  competition: {
                    type: "string"
                  },

                  marketingStrategy: {
                    type: "string"
                  },

                  toolsNeeded: {
                    type: "string"
                  },

                  ninetyDayPlan: {
                    type: "string"
                  },

                  firstSteps: {
                    type: "array",
                    minItems: 7,
                    maxItems: 7,
                    items: {
                      type: "string"
                    }
                  },

                  risks: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: {
                      type: "string"
                    }
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
                  "whyItCanWork",
                  "bestBusinessModel",

                  "startupCost",
                  "revenueModel",
                  "recommendedPricing",
                  "expectedMonthlyRevenue",

                  "firstCustomerStrategy",
                  "competition",

                  "marketingStrategy",
                  "toolsNeeded",
                  "ninetyDayPlan",

                  "firstSteps",
                  "risks",
                  "nextAction"

                ]

              }

            }
          }

        });


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

The user wants realistic business opportunities.

USER IDEA:
${idea}

AVAILABLE BUDGET:
${budget}

Create exactly 8 practical business opportunities.

Every opportunity must:

- be related specifically to the user's idea
- respect the available budget
- be realistic
- be different from the other opportunities
- avoid guaranteed profit claims

Difficulty must be:
Easy, Medium, or Hard.

Potential must be:
Low, Medium, or High.

Return exactly 8 recommendations.
`;


    const response =
      await client.responses.create({

        model: "gpt-5.6-luna",

        input: prompt,

        max_output_tokens: 1800,

        text: {

          format: {

            type: "json_schema",

            name: "business_recommendations",

            strict: true,

            schema: {

              type: "object",

              additionalProperties: false,

              properties: {

                recommendations: {

                  type: "array",

                  minItems: 8,

                  maxItems: 8,

                  items: {

                    type: "object",

                    additionalProperties: false,

                    properties: {

                      title: {
                        type: "string"
                      },

                      description: {
                        type: "string"
                      },

                      budget: {
                        type: "string"
                      },

                      difficulty: {
                        type: "string",
                        enum: [
                          "Easy",
                          "Medium",
                          "Hard"
                        ]
                      },

                      potential: {
                        type: "string",
                        enum: [
                          "Low",
                          "Medium",
                          "High"
                        ]
                      }

                    },

                    required: [
                      "title",
                      "description",
                      "budget",
                      "difficulty",
                      "potential"
                    ]

                  }

                }

              },

              required: [
                "recommendations"
              ]

            }

          }

        }

      });


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
