# 🎓 Campus Helper

A full-stack campus community platform designed to bring essential student services into one place — including lost & found, campus events, student marketplace, community polls, and an AI-powered wellness assistant.

🔗 **Live Demo:** https://campus-helper-xi.vercel.app/

---

## ✨ Features

### 🔐 Authentication

- Firebase Authentication
- Protected application routes
- User login and registration
- Persistent authentication state

### 🔎 Lost & Found

- Create lost and found item posts
- Add item title and description
- Browse reported items
- Compare lost and found item descriptions
- Generate a similarity score based on common words
- View potential matches

> The current matching system uses text-based word overlap. Semantic/embedding-based matching can be added as a future improvement.

### 📅 Campus Events

- Create campus events
- View upcoming events
- Event details
- Delete events
- Centralized event storage using Firestore

### 🛍️ Campus Marketplace

- Post items for sale
- Browse marketplace listings
- View seller information
- Remove marketplace listings

### 📊 Campus Pulse

- Community polls
- Vote on campus-related questions
- View poll results
- Local vote tracking to improve the user experience

### 🧠 MindCare AI

An AI-powered wellness assistant designed to provide a conversational space for students.

- Powered by Google Gemini
- Empathetic conversational responses
- Short and supportive responses
- Encourages users to express their thoughts
- Designed to avoid medical advice

### 🎨 User Experience

- Responsive React interface
- Dashboard-style navigation
- Modular feature structure
- Light/dark theme support
- React Icons
- Protected routes

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Routing | React Router |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Backend/API | Vercel Serverless Functions |
| AI | Google Gemini API |
| Styling | CSS |
| Icons | React Icons |
| Deployment | Vercel |

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ Firebase        │        │ Vercel API      │
        │ Authentication  │        │ Functions       │
        │                 │        │                 │
        │ Firestore       │        │ Gemini API      │
        └─────────────────┘        └─────────────────┘
```

---

## 📁 Project Structure

```text
campus-helper/
│
├── api/
│   ├── compare.js
│   ├── gemini.js
│   └── wellness.js
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── auth/
│   │   └── Login.jsx
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── firebase/
│   │   └── firebase.js
│   │
│   ├── modules/
│   │   ├── Events.jsx
│   │   ├── Home.jsx
│   │   ├── LostFound.jsx
│   │   ├── Marketplace.jsx
│   │   ├── Matches.jsx
│   │   ├── Pulse.jsx
│   │   └── Wellness.jsx
│   │
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── events.css
│   │   ├── global.css
│   │   ├── lostfound.css
│   │   ├── marketplace.css
│   │   ├── matches.css
│   │   ├── pulse.css
│   │   ├── sidebar.css
│   │   └── wellness.css
│   │
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔐 Authentication Flow

Firebase Authentication handles user authentication.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Firebase Authentication
 │
 ▼
Authenticated User
 │
 ▼
Protected Routes
 │
 ▼
Campus Helper Dashboard
```

Protected routes prevent unauthenticated users from accessing the main application.

---

## 🔎 Lost & Found Matching

The Lost & Found system provides a basic matching mechanism for reported items.

The backend compares the title and description of two items:

```text
Lost Item
   │
   ├── Title
   └── Description
          │
          ▼
   Text Processing
          │
          ▼
   Common Word Matching
          │
          ▼
   Similarity Score
          │
          ▼
   Match Confidence
```

The current implementation calculates a score from the number of common words between the two item descriptions.

This provides a lightweight baseline that can later be replaced with semantic embeddings for more meaningful similarity detection.

---

## 🧠 MindCare AI

MindCare AI uses the Google Gemini API to generate conversational wellness responses.

```text
Student
   │
   ▼
Message
   │
   ▼
Vercel API Function
   │
   ▼
Google Gemini API
   │
   ▼
AI Response
   │
   ▼
MindCare Interface
```

The AI prompt is designed to:

- Respond calmly and empathetically
- Avoid judgment
- Avoid giving medical advice
- Encourage emotional expression
- Ask gentle follow-up questions
- Keep responses concise

---

## 📊 Campus Pulse

Campus Pulse allows students to participate in community polls.

```text
Create / Display Poll
        │
        ▼
      Student
        │
        ▼
       Vote
        │
        ▼
   Store Vote Data
        │
        ▼
 Display Results
```

The current frontend also uses browser-side local storage to help prevent repeated voting from the same browser.

---

## 🗄️ Firebase / Firestore

Firestore is used as the application's cloud database.

The platform stores data for modules such as:

- Lost & Found
- Marketplace
- Events
- Campus Pulse
- Wellness conversations

Firebase provides the application's cloud authentication and database infrastructure.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- Firebase project
- Firebase Authentication enabled
- Firebase Firestore configured
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Swaritdixit/campus-helper.git
cd campus-helper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create/configure your Firebase project and add the required Firebase configuration to the application.

Firebase Authentication and Firestore should be enabled for the project.

### 4. Configure Gemini

The server-side wellness API requires:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

Keep API keys and other secrets outside the source code and never commit them to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## 🌐 Deployment

The project is designed for deployment using Vercel.

The frontend is built with Vite, while the `api/` directory contains serverless API functions used by the application.

### Live Application

🔗 **https://campus-helper-xi.vercel.app/**

---

## 🔒 Security Considerations

The application uses Firebase Authentication and Firestore as its backend infrastructure.

Important security considerations include:

- Authentication through Firebase
- Protected frontend routes
- Server-side handling of the Gemini API key
- Environment variables for secrets
- Firestore security rules for database authorization
- User ownership validation for user-generated content

> Firestore authorization and ownership rules should be reviewed carefully before treating the application as production-ready.

---

## 🧩 Key Implementation Areas

### Modular React Architecture

The application separates major functionality into independent modules:

- Events
- Lost & Found
- Marketplace
- Campus Pulse
- Wellness
- Authentication

This makes individual features easier to develop and maintain.

### Serverless APIs

The project uses API functions for backend operations such as:

- Text comparison
- Gemini-powered functionality
- Wellness responses

This allows backend functionality without maintaining a traditional long-running Express server.

### Firebase Integration

Firebase provides:

- Authentication
- Firestore database
- Cloud-based data persistence

### AI Integration

Google Gemini is integrated into MindCare AI to provide conversational responses through a server-side API endpoint.

---

## 📌 Future Improvements

- Replace word-overlap matching with semantic embeddings
- Improve Lost & Found matching using NLP/AI
- Implement stronger Firestore ownership and authorization rules
- Associate user-generated data with authenticated user IDs
- Improve marketplace seller authorization
- Add event ownership/admin permissions
- Store wellness conversations with appropriate user ownership controls
- Replace browser-only poll protection with server-side vote validation
- Add automated testing
- Add stronger input validation
- Improve error handling and loading states
- Add campus-wide notifications
- Add search and filtering across modules
- Add admin/moderator functionality
- Improve analytics for campus activity

---

## 🎯 What I Learned

Through this project, I worked with:

- React component architecture
- React Router
- Firebase Authentication
- Firestore
- Protected routes
- Serverless API functions
- Google Gemini API integration
- REST-style API handling
- Client-side state management
- Modular frontend architecture
- Cloud deployment with Vercel

---

## 👨‍💻 Author

**Swarit Dixit**

B.Tech Electronics & Communication Engineering  
IIT Bhilai

- 💻 GitHub: https://github.com/Swaritdixit
- 💼 LinkedIn: https://www.linkedin.com/in/swarit-dixit-b907b8309/
