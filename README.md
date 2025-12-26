
# ✍️ AI Journal App

An intelligent journaling app powered by LLMs that allows users to record daily thoughts and receive AI-generated summaries, mood detection, and mental wellness suggestions.

## 🚀 Features

* ✨ Create, edit, delete journal entries
* 🧠 AI-generated **summary**, **mood analysis**, and **wellness suggestions**
* 👤 Secure **signup/login** with protected routes
* 📅 Timeline view with date, mood chip, and AI insights
* 🧑‍🎤 User avatar and profile dropdown
* 🎨 Mood-based card coloring
* 🖊️ In-app entry editor with Lottie animation (optional)
* 🔒 Token-based auth with JWT

## 🧪 Sample Journal Entry & AI Response

**User Entry:**

> *"I’ve been feeling really overwhelmed with work lately. Deadlines are piling up and I’m struggling to keep up. I’m also worried I’m not doing enough, and it’s starting to affect my sleep and mood. I just want to find a way to manage everything better without burning out."*

**AI Response:**

```json
{
  "summary": "The user is feeling overwhelmed due to increasing work pressure and approaching deadlines. They’re worried about their productivity and this stress is affecting their sleep and overall mood. The journal reflects a desire to manage time better and avoid burnout. There is an underlying concern about self-worth and effectiveness. The tone suggests high anxiety and mental fatigue.",
  "mood": "Stressed",
  "suggestions": [
    "Try breaking down tasks into smaller, manageable chunks.",
    "Use a planner or digital calendar to prioritize deadlines.",
    "Incorporate short breaks and mindfulness exercises.",
    "Seek help or delegate tasks where possible.",
    "Ensure you get enough sleep and avoid overworking."
  ]
}
```

## 🛠️ Tech Stack

* **Frontend:** React.js, MUI, Axios, React Router
* **Backend:** Node.js, Express.js, MongoDB
* **AI API:** Groq's `openai` model (OpenAI-compatible)
* **Auth:** JWT token-based login/signup

## 🏗️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/ai-journal-app.git
   cd ai-journal-app
   ```

2. **Install dependencies**

   ```bash
   npm install  # For frontend
   cd server && npm install  # For backend
   ```

3. **Environment Variables**

   Create a `.env` file in the `server/` folder:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Start the app**

   * Backend: `npm start` (in `/server`)
   * Frontend: `npm run dev` (in root)

## 🌐 Deployment (Vite + Node.js)

* Make sure to build frontend:

  ```bash
  npm run build
  ```

* Serve `dist` using a static server or integrate into Express backend.

* Set environment variables in your cloud provider (e.g., Render, Railway, or Vercel for frontend + backend).

## 📷 UI Preview

> Add screenshots or demo GIFs here

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first to discuss what you’d like to change.


