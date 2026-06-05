<div align="center">

# 🤖 AI-Powered Resume Builder & ATS Optimizer

### Build smarter resumes. Beat the bots. Land the interview.

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)]()
[![ATS Optimized](https://img.shields.io/badge/ATS-Optimized-00C851?style=for-the-badge)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/mayurpatil10001/AI-powered-Resume-Builder-ATS-Optimization-app?style=for-the-badge&color=gold)](https://github.com/mayurpatil10001/AI-powered-Resume-Builder-ATS-Optimization-app/stargazers)

<br/>

> **75% of resumes are rejected by ATS bots before a human ever reads them.**  
> This app makes sure yours isn't one of them.

<br/>

![Demo Banner](https://via.placeholder.com/900x300/0d1117/58a6ff?text=AI+Resume+Builder+%7C+ATS+Optimizer)

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)
- [🔍 How ATS Optimization Works](#-how-ats-optimization-works)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Resume Generation** | Generate professional, tailored resume content using AI |
| 📊 **ATS Score Analyzer** | Get a real-time ATS compatibility score for your resume |
| 🔍 **Keyword Optimization** | Automatically match keywords to job descriptions |
| 📝 **Multiple Templates** | Choose from ATS-friendly, recruiter-approved templates |
| 📤 **Export to PDF/DOCX** | Download in multiple formats instantly |
| 💡 **Smart Suggestions** | Get actionable tips to improve your resume score |
| 🎯 **Job Description Matching** | Paste a JD and see how well your resume matches |
| ⚡ **Real-time Preview** | See changes live as you edit |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React.js / Next.js, Tailwind CSS |
| **Backend** | Python, FastAPI / Flask |
| **AI Engine** | OpenAI GPT / Gemini / Claude API |
| **Resume Parsing** | PyMuPDF, python-docx, pdfminer |
| **ATS Scoring** | Custom NLP pipeline, keyword matching |
| **Export** | LaTeX / WeasyPrint / ReportLab |
| **Database** | PostgreSQL / SQLite |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ (for frontend)
- An API key from OpenAI / Anthropic / Google

### 1. Clone the Repository

```bash
git clone https://github.com/mayurpatil10001/AI-powered-Resume-Builder-ATS-Optimization-app.git
cd AI-powered-Resume-Builder-ATS-Optimization-app
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
# AI API Key (choose one)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_claude_key_here

# Database
DATABASE_URL=sqlite:///./resume_builder.db

# App Config
SECRET_KEY=your_secret_key_here
DEBUG=True
```

### 4. Run the Application

```bash
# Start backend
python main.py
# or
uvicorn main:app --reload

# Start frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Open your browser at: **http://localhost:3000**

API docs available at: **http://localhost:8000/docs**

---

## 📸 Screenshots

<div align="center">

| Resume Builder | ATS Score | Template Gallery |
|:---:|:---:|:---:|
| ![Builder](https://via.placeholder.com/280x180/161b22/58a6ff?text=Resume+Editor) | ![ATS](https://via.placeholder.com/280x180/161b22/00C851?text=ATS+Score+87%25) | ![Templates](https://via.placeholder.com/280x180/161b22/f0883e?text=Templates) |

</div>

---

## 🔍 How ATS Optimization Works

```
Your Resume
    │
    ▼
┌─────────────────────────────┐
│   1. Resume Parsing          │  ← Extracts text from PDF/DOCX
│   2. Keyword Extraction      │  ← Identifies key skills & terms
│   3. JD Matching             │  ← Compares with job description
│   4. ATS Score Calculation   │  ← Scores compatibility (0-100)
│   5. AI Suggestions          │  ← Recommends improvements
│   6. Optimized Export        │  ← Clean, ATS-readable output
└─────────────────────────────┘
    │
    ▼
ATS-Optimized Resume ✅
```

**Scoring Breakdown:**
- 🟢 **80–100** → Excellent — ready to apply
- 🟡 **60–79** → Good — minor improvements needed
- 🔴 **0–59** → Needs work — follow the AI suggestions

---

## 📁 Project Structure

```
AI-powered-Resume-Builder-ATS-Optimization-app/
│
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── models.py            # Data models
│   ├── resume_parser.py     # PDF/DOCX parsing
│   ├── ats_scorer.py        # ATS scoring engine
│   ├── ai_generator.py      # AI content generation
│   ├── latex_generator.py   # PDF export via LaTeX
│   └── requirements.txt
│
├── frontend/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ResumeEditor/
│   │   ├── ATSScore/
│   │   └── TemplateGallery/
│   └── package.json
│
├── templates/               # Resume templates
├── .env.example
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and add tests where applicable.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**If this project helped you land a job, drop a ⭐ — it means a lot!**

Made with ❤️ by [Mayur Patil](https://github.com/mayurpatil10001)

</div>
