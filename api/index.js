export default async function handler(req, res) {
  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "Venturo API",
      message: "Venturo API is running"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const { idea, goal, budget, country } = req.body || {};

    if (!idea) {
      return res.status(400).json({
        ok: false,
        error: "Business idea is required"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const prompt = `
You are Venturo, a global AI business builder.

Analyze this business idea and provide practical recommendations.

Business idea: ${idea}
Goal: ${goal || "Build and grow a profitable business"}
Budget: ${budget || "Not specified"}
Country: ${country || "Not specified"}

Return a clear JSON object with:
{
  "business_summary": "",
  "target_customer": "",
  "market_opportunity": "",
  "business_model": "",
  "recommended_products": [],
  "marketing_strategy": [],
  "first_steps": [],
  "risks": [],
  "score": 0
}

The score must be between 0 and 100.
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are Venturo, an expert AI business builder."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.error?.message || "AI request failed"
      });
    }

    const content = data?.choices?.[0]?.message?.content || "";

    let result;

    try {
      result = JSON.parse(content);
    } catch {
      result = {
        business_summary: content
      };
    }

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Internal server error"
    });
  }
}
