# 🎓 AI Personalized Learning Platform

An intelligent web-based learning platform that generates personalized roadmaps, quizzes, and resources for any topic .


---

## ✨ Features

- 🗺️ **Personalized Roadmaps** — Week-by-week learning plans tailored to your knowledge level and time availability
- 🧠 **AI-Generated Quizzes** — Auto-generated MCQs with detailed explanations to test your understanding
- 📚 **Smart Resources** — AI-generated learning content with direct links to YouTube and Udemy
- 📊 **Progress Tracking** — Visual progress bars and completion stats across all your courses
- 🎯 **Hardness Index** — Dynamically adjusts time estimates based on how hard you find each topic
- 👤 **Custom Profile** — Upload your photo, set your name, track all ongoing courses
- 🌙 **Glassmorphism UI** — Modern dark blue glassmorphism design throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Chart.js, Lucide React |
| Backend | Python Flask |
| AI | Groq API — LLaMA 3.3 70B Versatile |
| Styling | Custom CSS — Glassmorphism Dark Blue Theme |
| Storage | localStorage (client-side) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Python 3.8+
- Groq API Key — get it free at [console.groq.com](https://console.groq.com)

---

### Installation

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd AIPersonalizedLearningPlatform
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Set up Python virtual environment**
```bash
cd backend
python -m venv learnai

# Windows
learnai\Scripts\activate

# Mac/Linux
source learnai/bin/activate

pip install -r requirements.txt
```

**4. Add your API key**

Create/edit `.flaskenv` inside the `backend/` folder:
```
FLASK_APP=base.py
FLASK_ENV=development
GROQ_API_KEY=your_groq_api_key_here
```

---

### Running the App

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
learnai\Scripts\activate
flask run
```

**Terminal 2 — Frontend**
```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 How It Works
```
User enters topic + time + knowledge level
            ↓
Groq AI generates personalized week-by-week roadmap
            ↓
User studies each subtopic
            ↓
Choose resources — AI Content / YouTube / Udemy
            ↓
AI generates MCQ quiz for each subtopic
            ↓
Progress tracked → Hardness Index adjusts difficulty
            ↓
Profile page shows overall progress with charts
```

---

## 📂 Project Structure
```
AIPersonalizedLearningPlatform/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── topic/
│   │   │   ├── topic.js        # Topic selection page
│   │   │   └── topic.css
│   │   ├── roadmap/
│   │   │   ├── roadmap.js      # Roadmap & resources page
│   │   │   └── roadmap.css
│   │   ├── quiz/
│   │   │   ├── quiz.js         # Quiz page
│   │   │   └── quiz.css
│   │   └── profile/
│   │       ├── profile.js      # User profile & progress
│   │       └── profile.css
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.js       # Navigation header
│   │   │   └── header.css
│   │   ├── loader/
│   │   │   ├── loader.js       # Loading screen
│   │   │   └── loader.css
│   │   └── modal/
│   │       ├── modal.js        # Resource modal
│   │       └── modal.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── backend/
│   ├── base.py                 # Flask API routes
│   ├── roadmap.py              # Roadmap generation
│   ├── quiz.py                 # Quiz generation
│   ├── generativeResources.py  # AI resources generation
│   ├── requirements.txt
│   └── .flaskenv               # API keys (do not commit)
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| POST | `/api/roadmap` | Generate personalized roadmap | `{ topic, time, knowledge_level }` |
| POST | `/api/quiz` | Generate MCQ quiz for a subtopic | `{ course, topic, subtopic, description }` |
| POST | `/api/generate-resource` | Generate AI learning content | `{ course, knowledge_level, description, time }` |

---

## 🧠 AI Models Used

| Feature | Model | Purpose |
|---|---|---|
| Roadmap Generation | LLaMA 3.3 70B | Creates structured JSON learning paths |
| Quiz Generation | LLaMA 3.3 70B | Generates MCQs with explanations in JSON |
| Resource Generation | LLaMA 3.3 70B | Creates markdown formatted learning content |

---

## 💡 Key Implementation Details

### Hardness Index
The platform tracks a **Hardness Index** that dynamically adjusts subtopic time estimates based on:
- Quiz performance (wrong answers increase index)
- Time taken per quiz
- User's self-rated difficulty per subtopic

### Progress Tracking
Progress is calculated using **time-weighted completion** — subtopics that take longer count more toward overall progress, giving a more accurate picture than simple count-based tracking.

### Offline Quiz Caching
Generated quizzes are **cached in localStorage** so they don't need to be regenerated every time, saving API calls and improving load speed.

---

## ⚙️ Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | `backend/.flaskenv` | Your Groq API key |
| `FLASK_APP` | `backend/.flaskenv` | Flask entry point (`base.py`) |
| `FLASK_ENV` | `backend/.flaskenv` | Environment (`development`) |

---

## 🔮 Future Improvements

- [ ] Database integration for cross-device sync
- [ ] User authentication system
- [ ] Mobile app (React Native)
- [ ] Deploy online (Vercel + Railway)
- [ ] AI-powered study schedule reminders
- [ ] Community roadmap sharing
- [ ] Multiple language support

---

## 🐛 Known Issues

- Data is stored in `localStorage` — clearing browser data will reset all progress
- Quiz generation may take 10-15 seconds depending on Groq API response time
- App requires both frontend and backend servers running simultaneously

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Ultra-fast LLM inference
- [LLaMA 3.3](https://ai.meta.com) — Open source language model by Meta
- [Lucide React](https://lucide.dev) — Beautiful icon library
- [Chart.js](https://chartjs.org) — Progress visualization

---

> Built with ❤️ using React, Flask, and Groq AI
