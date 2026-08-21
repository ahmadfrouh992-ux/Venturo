import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
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
      service: "Venturo AI Business Builder",
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

    const prompt = `
You are Venturo, a professional global AI business builder.

Analyze this business idea:

Business idea: ${idea}
Budget: ${budget}

Create 8 practical business opportunities related specifically
to the user's idea.

Return ONLY valid JSON in exactly this format:

{
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "budget": "string",
      "difficulty": "Easy",
      "potential": "High"
    }
  ]
}

Rules:
- Return exactly 8 recommendations.
- Make every recommendation relevant to the user's actual idea.
- Respect the user's budget.
- Use realistic startup budgets.
- Difficulty must be Easy, Medium, or Hard.
- Potential must be Low, Medium, or High.
- Do not promise guaranteed profits.
- Keep descriptions concise.
- Use English.
`;

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: prompt
    });

    const text = response.output_text || "";

    let aiResult;

    try {
      aiResult = JSON.parse(text);
    } catch (error) {
      console.error("Invalid AI JSON:", text);

      return res.status(500).json({
        ok: false,
        success: false,
        error: "AI returned an invalid response."
      });
    }

    if (
      !aiResult.recommendations ||
      !Array.isArray(aiResult.recommendations)
    ) {
      return res.status(500).json({
        ok: false,
        success: false,
        error: "Invalid AI recommendation response."
      });
    }

    return res.status(200).json({
      ok: true,
      success: true,
      idea,
      budget,
      recommendations: aiResult.recommendations
    });

  } catch (error) {
    console.error("Venturo AI error:", error);

    return res.status(500).json({
      ok: false,
      success: false,
      error: "Venturo AI service error."
    });
  }
}
