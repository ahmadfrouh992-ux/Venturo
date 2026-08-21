# Venturo

Global AI Business Builder — ideas, recommendations, and tools to build businesses.

## Structure

- `index.html` — responsive Venturo web interface
- `api/health.js` — deployment health endpoint
- `api/recommend.js` — recommendation API
- `vercel.json` — Vercel configuration
- `package.json` — project metadata

## Deploy

This project is designed for Vercel and does not require a database or secret API key for the first version.

After deployment:

- `/` loads the Venturo app.
- `/api/health` confirms the API is running.
- `/api/recommend` returns business recommendations.

## Next development phase

The foundation can later be extended with user accounts, saved ideas, real AI provider integration, payments, analytics, and a database.
