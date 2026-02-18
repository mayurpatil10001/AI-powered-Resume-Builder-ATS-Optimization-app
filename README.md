AI-powered Resume Builder & ATS Optimization app (Next.js App Router + Tailwind + shadcn/ui).

## Getting Started

1) Install deps (already installed if you used the scaffold in this repo):

```bash
npm install
```

2) Configure env vars:

```bash
copy .env.example .env.local
```

Set:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (default: `http://localhost:3000`)

3) Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Input: upload PDF/DOCX or manual form entry.
- ATS score: keyword match, formatting, readability, section completeness.
- AI enhancement: OpenAI `gpt-4o` then Gemini second pass for fluency/keywords.
- Templates: `classic`, `modern`, `minimal` with live preview.
- Export: `.docx` (server-side) + PDF (Puppeteer + serverless Chromium).
- Comparison mode: original vs enhanced.
- Feedback chat: floating widget (context-aware).

## API Routes

- `POST /api/parse-resume` (multipart form-data `file`)
- `POST /api/ats-score` (`{ resumeText, targetRole }`)
- `POST /api/enhance-resume` (`{ resumeData | resumeText, targetRole }`)
- `POST /api/generate-docx` (`{ resumeData, templateId? }`)
- `POST /api/generate-pdf` (`{ resumeData, templateId }`)
- `POST /api/chat` (`{ messages, context }`)

## Notes

- Local PDF generation: set `PUPPETEER_EXECUTABLE_PATH` to a Chrome/Chromium executable path if you want PDF export to work locally. On Vercel it uses serverless Chromium automatically.

## Deploy on Vercel

1) Import the repo in Vercel.
2) Set environment variables in Vercel project settings:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your deployed URL)

3) Deploy.
