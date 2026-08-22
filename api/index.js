import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET - health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      success: true,
      service: "Venturo AI Business Builder",
      status: "running"
    });
  }

  // POST only
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

      const prompt = `
You are Venturo, a professional global AI business builder.

The user wants to build a real business.

BUSINESS IDEA:
${idea}

AVAILABLE BUDGET:
${budget}

Create a practical business blueprint.

Return ONLY valid JSON using exactly this structure:

{
  "summary": "short business summary",
  "score": 8,
  "targetCustomer": "ideal target customers",
  "startupCost": "realistic estimated startup cost",
  "revenueModel": "how the business makes money",
  "competition": "competition assessment",
  "growthPotential": "growth assessment",
  "bestBusinessModel": "best business model for this idea",
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
- Make everything specific to the user's business idea.
- Respect the user's budget.
- Be realistic.
- Do not promise guaranteed profits.
- Do not invent statistics.
- Keep the language clear and practical.
- Use English.
`;

      const response =
        await client.responses.create({
          model: "gpt-5-mini",
          input: prompt
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
          error: "AI returned invalid business analysis."
        });

      }

      return res.status(200).json({
        ok: true,
        success: true,
        action: "build",
        idea,
        budget,
        analysis
      });
    }

    // =====================================================
    // FIND IDEAS
    // =====================================================

    const prompt = `
You are Venturo, a professional global AI business builder.

Analyze the user's business idea.

BUSINESS IDEA:
${idea}

AVAILABLE BUDGET:
${budget}

Create exactly 8 practical business opportunities related specifically to the user's idea.

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
- Every recommendation must be related to the user's actual idea.
- Do not return unrelated generic businesses.
- Respect the user's budget.
- Difficulty must be Easy, Medium, or Hard.
- Potential must be Low, Medium, or High.
- Do not promise guaranteed profits.
- Use realistic business ideas.
- Keep descriptions concise.
- Use English.
`;

    const response =
      await client.responses.create({
        model: "gpt-5-mini",
        input: prompt
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
        error: "AI returned invalid recommendations."
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
        error: "Invalid recommendation response."
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
      "Venturo AI error:",
      error
    );

    return res.status(500).json({
      ok: false,
      success: false,
      error:
        error?.message ||
        "Venturo AI service error."
    });

  }
}
