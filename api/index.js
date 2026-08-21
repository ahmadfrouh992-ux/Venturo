<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Venturo — Global AI Business Builder</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f4f6fa;
      color: #111827;
    }

    header {
      background: #071126;
      color: white;
      padding: 22px 6%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 24px;
      font-weight: 800;
    }

    .logo span {
      color: #3b82f6;
    }

    nav {
      display: flex;
      gap: 25px;
      font-size: 15px;
    }

    .hero {
      background: linear-gradient(135deg, #101b3d, #182653);
      color: white;
      padding: 90px 6% 130px;
    }

    .hero-inner {
      max-width: 1100px;
      margin: auto;
    }

    .eyebrow {
      color: #8db9ff;
      font-weight: 700;
      letter-spacing: 3px;
      font-size: 14px;
      margin-bottom: 25px;
    }

    h1 {
      font-size: clamp(48px, 7vw, 76px);
      line-height: 1;
      margin: 0 0 30px;
      max-width: 850px;
    }

    .subtitle {
      color: #cbd5e1;
      font-size: 20px;
      line-height: 1.7;
      max-width: 760px;
    }

    .builder {
      max-width: 1000px;
      margin: -70px auto 0;
      position: relative;
      padding: 28px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 15px 50px rgba(0,0,0,.15);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 180px 150px;
      gap: 12px;
    }

    input,
    select,
    button {
      height: 58px;
      border-radius: 12px;
      font-size: 16px;
    }

    input,
    select {
      border: 1px solid #d1d5db;
      padding: 0 16px;
      background: white;
    }

    button {
      border: none;
      background: #2563eb;
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    button:disabled {
      opacity: .6;
      cursor: wait;
    }

    .message {
      margin-top: 15px;
      color: #64748b;
      min-height: 22px;
    }

    .section {
      max-width: 1100px;
      margin: 70px auto;
      padding: 0 20px;
    }

    .section h2 {
      font-size: 36px;
      margin-bottom: 30px;
    }

    #results {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 18px;
      padding: 25px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 5px 20px rgba(0,0,0,.05);
    }

    .card h3 {
      margin-top: 0;
      font-size: 22px;
    }

    .card p {
      color: #64748b;
      line-height: 1.6;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }

    .tag {
      background: #eef2ff;
      color: #3730a3;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .empty {
      color: #64748b;
      font-size: 18px;
    }

    footer {
      background: #071126;
      color: #94a3b8;
      text-align: center;
      padding: 30px;
      margin-top: 100px;
    }

    @media (max-width: 750px) {
      header {
        padding: 20px;
      }

      .hero {
        padding: 65px 20px 110px;
      }

      h1 {
        font-size: 50px;
      }

      .subtitle {
        font-size: 18px;
      }

      .builder {
        margin: -55px 16px 0;
        padding: 18px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      #results {
        grid-template-columns: 1fr;
      }

      nav {
        gap: 12px;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="logo">Venturo<span>.</span></div>

  <nav>
    <div>Builder</div>
    <div>Ideas</div>
  </nav>
</header>

<section class="hero">
  <div class="hero-inner">

    <div class="eyebrow">
      GLOBAL AI BUSINESS BUILDER
    </div>

    <h1>
      Turn an idea into a business.
    </h1>

    <div class="subtitle">
      Venturo helps entrepreneurs discover practical business
      opportunities, compare options, and turn a simple idea
      into an actionable starting plan.
    </div>

  </div>
</section>

<section class="builder">

  <div class="form-row">

    <input
      id="idea"
      type="text"
      placeholder="What do you want to build? e.g. online business for £100"
    >

    <select id="budget">
      <option value="Any budget">Any budget</option>
      <option value="£0–£100">£0–£100</option>
      <option value="£100–£500">£100–£500</option>
      <option value="£500–£1,000">£500–£1,000</option>
      <option value="£1,000+">£1,000+</option>
    </select>

    <button id="findButton" onclick="findIdeas()">
      Find ideas
    </button>

  </div>

  <div id="message" class="message"></div>

</section>

<section class="section">

  <h2>Business opportunities</h2>

  <div id="results">
    <div class="empty">
      Enter an idea above to discover business opportunities.
    </div>
  </div>

</section>

<footer>
  © 2026 Venturo — Global AI Business Builder
</footer>

<script>

async function findIdeas() {

  const ideaInput = document.getElementById("idea");
  const budgetInput = document.getElementById("budget");
  const button = document.getElementById("findButton");
  const message = document.getElementById("message");
  const results = document.getElementById("results");

  const idea = ideaInput.value.trim();
  const budget = budgetInput.value;

  if (!idea) {
    message.textContent = "Please enter a business idea.";
    ideaInput.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Finding...";
  message.textContent = "Finding the best business opportunities...";
  results.innerHTML = "";

  try {

    const response = await fetch("/api", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        idea: idea,
        budget: budget
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Recommendation service error."
      );
    }

    if (
      !data.recommendations ||
      !Array.isArray(data.recommendations)
    ) {
      throw new Error("Invalid recommendation response.");
    }

    message.textContent =
      `Found ${data.recommendations.length} business opportunities.`;

    results.innerHTML = data.recommendations
      .map(item => {

        return `
          <div class="card">

            <h3>${escapeHtml(item.title)}</h3>

            <p>
              ${escapeHtml(item.description)}
            </p>

            <div class="tags">

              <div class="tag">
                Budget: ${escapeHtml(item.budget)}
              </div>

              <div class="tag">
                Difficulty: ${escapeHtml(item.difficulty)}
              </div>

              <div class="tag">
                Potential: ${escapeHtml(item.potential)}
              </div>

            </div>

          </div>
        `;

      })
      .join("");

  } catch (error) {

    console.error("Venturo error:", error);

    message.textContent =
      "Venturo could not reach the recommendation service. Please try again.";

    results.innerHTML = `
      <div class="empty">
        The recommendation service is temporarily unavailable.
      </div>
    `;

  } finally {

    button.disabled = false;
    button.textContent = "Find ideas";

  }
}


function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

</script>

</body>
</html>
