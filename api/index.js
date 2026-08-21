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

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      success: true,
      service: "Venturo AI Business Builder",
      status: "running"
    });
  }

  // Only POST
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

Analyze the following business idea and create practical business opportunities specifically related to it.

Business idea:
${idea}

Available budget:
${budget}

Return ONLY valid JSON.

Use exactly this structure:

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

Rules:

1. Return exactly 8 recommendations.
2. Every recommendation must be related to the user's actual business idea.
3. Do not return generic unrelated businesses.
4. Respect the user's budget.
5. Difficulty must be exactly:
   Easy
   Medium
   Hard
6. Potential must be exactly:
   Low
   Medium
   High
7. Do not promise guaranteed profits.
8. Use realistic business ideas.
9. Keep descriptions concise.
10. Use English.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt
    });

    const text = response.output_text || "";

    if (!text) {
      return res.status(500).json({
        ok: false,
        success: false,
        error: "Empty response from AI."
      });
    }

    let aiResult;

    try {
      aiResult = JSON.parse(text);
    } catch (parseError) {
      console.error("AI JSON parsing error:", text);

      return res.status(500).json({
        ok: false,
        success: false,
        error: "AI returned an invalid response."
      });
    }

    if (
      !aiResult ||
      !Array.isArray(aiResult.recommendations)
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
      idea: idea,
      budget: budget,
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
