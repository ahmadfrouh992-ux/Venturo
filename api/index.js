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

Your job is to transform the user's selected business idea into a realistic, practical, beginner-friendly business blueprint.

ORIGINAL USER IDEA:
${idea}

SELECTED BUSINESS:
${businessToBuild}

AVAILABLE BUDGET:
${budget}

IMPORTANT BUSINESS RULES:

1. The business must be realistic for a beginner.
2. Respect the user's available budget.
3. If the budget is limited, recommend a lean version of the business.
4. Never promise guaranteed profits.
5. Do not invent certainty about market demand.
6. Use realistic assumptions and clearly communicate estimates.
7. Assume the business initially operates in London unless the idea clearly requires another location.
8. Prefer simple businesses that can realistically get their first customer quickly.
9. Avoid generic advice. Make every answer specific to this business.
10. Focus on execution, not motivational language.

BUSINESS SCORE:

Give five scores from 1 to 10:

- Market Demand
- Profit Potential
- Competition
- Ease of Launch
- Scalability

The scores must reflect the actual business idea.

Calculate the overall score using these five factors:

Market Demand: 25%
Profit Potential: 25%
Competition: 15%
Ease of Launch: 20%
Scalability: 15%

Round the final score to one decimal place.

For Competition, a higher score means the business has a more favorable competitive position for a beginner, not simply that competition is high.

BUSINESS:

Explain:

- who the target customer is
- the specific problem they have
- the solution
- why this business could work
- the best business model

The target customer should be specific rather than something broad like "everyone".

MONEY:

Startup Cost:
Give a realistic estimated startup cost in GBP (£).
Break the estimate into the most important initial expenses when useful.

Revenue Model:
Explain exactly how the business makes money.

Pricing:
Give realistic prices in GBP (£).
If there are different pricing options, provide a simple recommended pricing structure.

Expected Monthly Revenue:
Give a realistic example rather than a guaranteed result.

Use a simple scenario such as:
number of customers × average price = estimated monthly revenue.

Make clear that this is an example estimate, not a guarantee.

FIRST CUSTOMER:

Explain:

- exactly who the first customer should be
- where to find them
- what offer to make
- how to approach them
- why they would say yes

Make this practical enough for a beginner to act on immediately.

COMPETITION:

Explain:

- what alternatives or competitors the customer may already use
- how this business can differentiate itself
- one clear competitive advantage

MARKETING:

Create a practical low-cost marketing strategy.

Prioritize realistic channels for a beginner, such as:

- direct outreach
- local businesses
- social media
- communities
- referrals
- partnerships
- marketplaces
- simple content

Do not recommend expensive advertising unless the budget makes it realistic.

TOOLS:

List only the essential tools needed to start.

Prefer low-cost or free tools where possible.

90-DAY PLAN:

Create a practical 90-day execution plan.

Divide it into:

Days 1–30:
Validation and setup

Days 31–60:
First customers and improvement

Days 61–90:
Growth and optimization

Each phase should contain concrete actions.

FIRST 7 STEPS:

Provide exactly 7 numbered steps.

Each step must be an action the user can actually perform.

The steps should move logically from idea → validation → launch → first customer → improvement.

KEY RISKS:

Provide exactly 4 important risks specific to this business.

For each risk, briefly explain how the beginner can reduce or manage it.

NEXT ACTION:

Give ONE clear action the user should take immediately after reading the blueprint.

The next action should be specific and achievable, not generic advice.

QUALITY STANDARD:

The final blueprint should feel like a mini professional business plan.

Keep every section concise but useful.

Avoid repetitive statements.

Avoid vague phrases such as "use social media to grow".

Instead explain what to do, who to target, and why.

Use GBP (£) for money.

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
- strictly respect the available budget
- be realistic for a beginner
- be different from the other opportunities
- avoid guaranteed profit claims

BUDGET RULES:

- If the available budget is a specific amount, every recommendation must be realistically launchable within that budget.
- Do not recommend startup costs above the user's available budget.
- If the budget is £100, recommendations must be launchable with approximately £100 or less.
- If the budget is £500, recommendations must be launchable with approximately £500 or less.
- If the budget is £1,000, recommendations must be launchable with approximately £1,000 or less.
- Always use GBP (£) when describing budgets or startup costs.
- If the available budget is "Any budget", choose sensible and realistic startup costs rather than automatically suggesting expensive businesses.

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
