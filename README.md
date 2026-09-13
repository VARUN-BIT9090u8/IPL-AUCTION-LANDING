<div align="center">

<img src="./public/readme-assets/ipl-logo.png" width="120" height="120" alt="IPL Auction Arena Logo">

# 🏏 IPL Auction Arena

### Real-Time Multiplayer IPL Auction & Fantasy Platform

<p>
A modern web-based IPL auction simulation platform that brings
real-time multiplayer bidding, franchise management, live auction
synchronization, and fantasy team management into one interactive experience.
</p>

<br>

<a href="https://ipl-auction-landing.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-ipl--auction--landing.vercel.app-black?style=for-the-badge" alt="Live Demo">
</a>

<a href="https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub">
</a>

<br><br>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

# 📌 Table of Contents

- [Overview](#-overview)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Auction System](#-auction-system)
- [Custom Bidding](#-custom-bidding)
- [Real-Time Synchronization](#-real-time-synchronization)
- [Franchise Management](#-franchise-management)
- [Auction Formats](#-auction-formats)
- [Fantasy Arena](#-fantasy-arena)
- [Admin Controls](#-admin-controls)
- [Authentication](#-authentication)
- [User Interface](#-user-interface)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Auction Workflow](#-auction-workflow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Production Build](#-production-build)
- [Deployment](#-deployment)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [Limitations](#-limitations)
- [Project Information](#-project-information)
- [License](#-license)

---

# 🎯 Overview

**IPL Auction Arena** is a real-time multiplayer IPL auction simulation platform developed as a major project.

The platform is designed to simulate the experience of an IPL-style player auction where multiple participants can manage their own franchise, compete for players, monitor their available budget, and build a squad through live bidding.

The application combines:

- Real-time multiplayer interaction
- Auction-room management
- Dynamic player bidding
- Franchise budget management
- Squad restrictions
- Overseas-player restrictions
- Synchronized auction timers
- Live auction activity
- Fantasy team management
- Firebase-powered cloud synchronization
- Modern sports-broadcast inspired UI

The application is deployed using **Vercel** and uses **Firebase** for application services.

---

# 🚀 Live Application

## Live Demo

### 👉 https://ipl-auction-landing.vercel.app/

Open the deployed application:

**[IPL Auction Arena — Live Demo](https://ipl-auction-landing.vercel.app/)**

## Source Code

### 👉 https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING

**[View the GitHub Repository](https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING)**

---

# 🎓 Project Objectives

The primary objective of this project is to develop an interactive real-time auction platform that demonstrates how distributed users can participate in the same auction environment while maintaining synchronized application state.

### Main objectives

- Build a real-time multiplayer auction environment.
- Implement secure user authentication.
- Allow users to participate through IPL franchises.
- Implement real-time player bidding.
- Maintain synchronized auction state between users.
- Implement auction countdown timers.
- Validate bids against available budgets.
- Enforce squad-size restrictions.
- Enforce overseas-player restrictions.
- Provide auction administration controls.
- Provide live activity monitoring.
- Build a fantasy arena using acquired players.
- Create a responsive and modern sports-oriented interface.
- Deploy the application to a production environment.

---

# ✨ Key Features

## 🏏 1. Real-Time Auction Engine

The auction engine is the central component of the platform.

Players are introduced into the auction individually and participants compete through live bidding.

### Features

- Live player auctions
- Real-time bid updates
- Highest bidder tracking
- Auction countdown timer
- SOLD / UNSOLD player states
- Auction pause/resume
- Admin-controlled auction flow
- Live auction activity
- Automatic budget updates
- Squad validation
- Overseas-player validation

---

# 💰 2. Dynamic Bidding

Participants can place bids while an auction is active.

The system validates each bid against the current auction state before accepting it.

A valid bid updates:

```text
Current Bid
      ↓
Highest Bidder
      ↓
Bid Timer
      ↓
Team Budget
      ↓
Live Auction State

The updated state is then synchronized with other connected participants.

🎯 3. Custom Bidding

One of the major interactive features of the auction interface is the ability to support a custom bid amount.

Instead of forcing a participant to repeatedly click the normal increment button, the participant can select a desired bid amount.

Example
Current Bid

₹3.00 Cr


Custom Bid

₹10.00 Cr


┌─────────────────────────┐
│     PLACE CUSTOM BID    │
└─────────────────────────┘

This makes the auction interaction more realistic and allows participants to aggressively increase their bid when competing for a priority player.

Before a custom bid is accepted, the system can validate the bid against the auction's current state and the participating team's available budget.

⚡ 4. Real-Time Synchronization

The platform uses Firebase Realtime Database to synchronize auction state between connected clients.

The auction state can include information such as:

Current player
Current bid
Highest bidder
Highest bidder team
Auction status
Timer state
Player status
Participant information

This allows multiple users to participate in the same auction room without manually refreshing the page.

⏱️ 5. Synchronized Auction Timer

Auction timers are synchronized using server-time information rather than relying entirely on the local clock of each user's computer.

This helps prevent different clients from displaying substantially different auction countdowns.

When a valid bid is placed, the auction timer can be reset according to the configured bid timer.

🏢 6. Franchise Management

Each participant manages an IPL franchise during the auction.

The franchise interface provides information such as:

Remaining purse
Players purchased
Squad size
Overseas players
Player categories
Spending
Available squad slots

Example:

TEAM
Mumbai Indians

PURSE
₹118 Cr

SQUAD
1 / 25

OVERSEAS
0 / 8

SPENT
₹2 Cr
🧩 7. Squad Validation

The auction engine validates squad constraints before allowing additional players to be purchased.

Squad limit

A team cannot exceed its configured squad limit.

Overseas limit

A team cannot exceed its configured overseas-player quota.

Budget limit

A team cannot place a bid that exceeds its available budget.

These validations prevent invalid auction states.

🏆 8. Auction Formats

The platform supports configurable auction formats.

Format	Squad Limit	Overseas Limit	Budget
Mega	25	8	₹120 Cr
Sprint 11	11	4	₹90 Cr
Sprint 5	5	2	₹60 Cr

These values are used by the auction system to determine team constraints.

👥 9. Multiplayer Lobby

Before entering the auction, participants can join an auction room.

The lobby provides functionality around:

Auction-room participation
Team/franchise selection
Participant management
Auction configuration
Pre-auction coordination
Live chat
Admin controls

Participants can then transition from the lobby into the live auction room.

💬 10. Live Auction Activity

The auction interface includes an activity area for important auction events.

Examples include:

Auction resumed by Admin

Player sold to Mumbai Indians

Player went unsold

New highest bidder

Auction paused by Admin

This provides participants with a chronological view of important auction events.

👨‍💼 11. Admin Controls

Administrators can control the auction environment.

Depending on the configured auction mode, administrative functionality includes:

Starting an auction
Pausing an auction
Resuming an auction
Managing participants
Removing participants
Managing player flow
Monitoring auction activity
Managing auction configuration

The administrator controls the state of the auction while participants interact with the bidding interface.

🏏 12. Fantasy Arena

The project also provides a Fantasy Arena concept built around players acquired during the auction.

Participants can use their auction acquisitions to construct fantasy teams.

Fantasy functionality includes concepts such as:

Playing XI selection
Captain selection
Vice-Captain selection
Impact Player selection
Fantasy scoring
Leaderboard-based ranking
📊 13. Fantasy Scoring

The Fantasy Arena is designed to convert player performance data into fantasy points.

Supported performance categories can include:

Runs
Wickets
Catches
Strike rate
Other supported match statistics

Captain and Vice-Captain selections can receive higher scoring multipliers.

Player Role	Multiplier
Regular Player	1×
Vice-Captain	1.5×
Captain	2×
🔐 14. Authentication

The application uses Firebase Authentication for user authentication.

Authentication allows the application to associate:

User
 ↓
Auction Room
 ↓
Franchise
 ↓
Bids
 ↓
Squad

This provides a user-specific identity throughout the auction experience.

🎨 User Interface

The interface is designed around a modern sports-broadcast aesthetic.

UI characteristics
Dark theme
Blue-focused visual system
Glassmorphism
Responsive layouts
Animated transitions
Live status indicators
Player cards
Auction countdown
Team dashboards
Activity panels
Interactive controls
Framer Motion animations

The interface is intentionally designed to feel closer to a live sports platform than a conventional college CRUD application.

🧠 System Architecture

The high-level architecture can be represented as:

                         ┌─────────────────────┐
                         │      Vercel         │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                                    │
                         ┌──────────▼──────────┐
                         │   Firebase Auth     │
                         │ Authentication      │
                         └──────────┬──────────┘
                                    │
                                    │
                    ┌───────────────▼───────────────┐
                    │                               │
          ┌─────────▼─────────┐         ┌──────────▼─────────┐
          │   Firestore       │         │ Firebase RTDB      │
          │                   │         │                    │
          │ Persistent Data   │         │ Real-Time Auction  │
          │                   │         │ Synchronization    │
          └───────────────────┘         └──────────┬─────────┘
                                                   │
                                                   │
                                    ┌──────────────▼──────────────┐
                                    │       Connected Users       │
                                    │                             │
                                    │  User 1   User 2   User 3  │
                                    └─────────────────────────────┘
🔄 Auction Workflow
┌────────────────────┐
│    Landing Page    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Authentication     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Create / Join Room │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│       Lobby        │
│                    │
│ Team Selection     │
│ Participants       │
│ Configuration      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    Auction Room    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    Player Listed   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      Bidding       │
│                    │
│ Normal Bid         │
│ Custom Bid         │
│ Timer              │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    SOLD / UNSOLD   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    Squad Update    │
│    Budget Update   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Next Player       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Auction Summary   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Fantasy Arena    │
└────────────────────┘
🛠️ Technology Stack
Frontend
Technology	Purpose
React	Frontend application
Vite	Development/build tooling
Tailwind CSS	Styling
Framer Motion	Animations
Lucide React	UI icons
Backend / Cloud
Technology	Purpose
Firebase Authentication	User authentication
Firebase Realtime Database	Real-time auction synchronization
Cloud Firestore	Persistent application data
Deployment
Technology	Purpose
Vercel	Production deployment
GitHub	Source-code repository
📂 Project Structure
IPL-AUCTION-LANDING/
│
├── public/
│   ├── images/
│   └── readme-assets/
│
├── scripts/
│   ├── autoUpdateFantasy.js
│   ├── backfillIPL2026.js
│   ├── deployDatabaseRules.js
│   └── uploadConsolidatedPoints.js
│
├── src/
│   │
│   ├── components/
│   │   └── fantasy/
│   │
│   ├── contexts/
│   │
│   ├── data/
│   │
│   ├── lib/
│   │
│   ├── pages/
│   │   ├── AuctionRoom.jsx
│   │   ├── AuctionSummary.jsx
│   │   ├── FantasyAdmin.jsx
│   │   ├── LandingPage.jsx
│   │   └── Lobby.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── database.rules.json
├── firebase.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
🚀 Getting Started
Prerequisites

Make sure you have the following installed:

Node.js 18 or later
npm
Git
A Firebase project
1. Clone the Repository
git clone https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING.git

Move into the project:

cd IPL-AUCTION-LANDING
2. Install Dependencies
npm install
3. Configure Firebase

Create a Firebase project and configure:

Firebase Authentication
Cloud Firestore
Firebase Realtime Database

Then create a local .env file.

🔐 Environment Variables

Create:

.env

Example:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_ADMIN_EMAIL=your_admin_email
VITE_CRICKET_API_KEY=your_cricket_api_key
⚠️ Security Warning

Never commit the real .env file to GitHub.

The repository should contain:

.env.example

instead of:

.env

The .env file should be included in .gitignore.

▶️ Run the Project Locally

Start the development server:

npm run dev

Vite will provide a local development URL, normally:

http://localhost:5173
🏗️ Production Build

Build the application:

npm run build

Preview the production build:

npm run preview
🚀 Deployment

The production application is deployed using Vercel.

Production URL
https://ipl-auction-landing.vercel.app/
Deployment workflow
Local Development
       │
       ▼
    Git Commit
       │
       ▼
    Git Push
       │
       ▼
     GitHub
       │
       ▼
     Vercel
       │
       ▼
 Production Application

Vercel automatically builds and deploys the project from the connected GitHub repository.

🔒 Security Considerations

The application uses Firebase services and therefore requires appropriate Firebase security rules.

Important security practices include:

Never expose private API keys unnecessarily.
Never commit .env files.
Use Firebase Authentication for user identity.
Configure Firestore security rules.
Configure Realtime Database security rules.
Validate auction operations.
Validate user permissions.
Validate team budgets.
Validate squad limits.
Validate overseas-player limits.

Client-side validation should not be considered a complete security boundary. Sensitive authorization decisions should be enforced by backend/database security rules where applicable.

📊 Auction Data Validation

Before accepting a bid, the application checks relevant auction conditions.

Conceptually:

Is auction active?
       │
       ├── NO → Reject bid
       │
       ▼
Is user authenticated?
       │
       ├── NO → Reject bid
       │
       ▼
Does user have a franchise?
       │
       ├── NO → Reject bid
       │
       ▼
Is user already highest bidder?
       │
       ├── YES → Reject bid
       │
       ▼
Squad limit available?
       │
       ├── NO → Reject bid
       │
       ▼
Overseas quota available?
       │
       ├── NO → Reject bid
       │
       ▼
Sufficient budget?
       │
       ├── NO → Reject bid
       │
       ▼
      VALID
       │
       ▼
Update auction state
🧪 Testing

Before deploying changes, verify the following:

Authentication
 User can register/login.
 User can logout.
 Invalid authentication is handled.
Lobby
 Room can be created.
 Room can be joined.
 Participants are displayed.
 Teams can be selected.
Auction
 Auction can start.
 Player is displayed.
 Current bid is visible.
 Normal bid works.
 Custom bid works.
 Highest bidder updates.
 Timer updates.
 Timer resets after valid bidding.
 SOLD state works.
 UNSOLD state works.
 Pause works.
 Resume works.
Team Management
 Budget decreases after purchase.
 Squad count increases.
 Squad limit is enforced.
 Overseas limit is enforced.
Deployment
 Production build succeeds.
 Firebase environment variables are configured.
 Production authentication works.
 Production database access works.
🔮 Future Enhancements

Possible future improvements include:

🤖 AI-based player valuation
📈 Advanced auction analytics
🧠 AI-powered squad recommendations
📊 Player performance prediction
🎙️ Real-time voice communication
🏆 Tournament-based auction modes
📱 Improved mobile-first experience
📉 Advanced spending analytics
🧮 Advanced fantasy scoring models
🛡️ Stronger server-side auction validation
📡 More live cricket-data integrations

These are planned enhancement areas and should not be interpreted as currently implemented functionality.

⚠️ Limitations

The project is an auction simulation platform and is not an official IPL application.

The system should not be interpreted as an official IPL auction service, official IPL fantasy product, or official IPL data platform.

External cricket statistics and player information may depend on the availability and accuracy of the configured data source.

📚 Learning Outcomes

This project provides practical experience with:

React application architecture
Component-based UI development
Vite build tooling
Tailwind CSS
Framer Motion
Firebase Authentication
Firebase Realtime Database
Cloud Firestore
Real-time state synchronization
Multiplayer application design
Auction algorithms
State validation
Authentication flows
Responsive UI design
Git/GitHub workflows
Vercel deployment
👨‍💻 Project Information
Category	Details
Project Name	IPL Auction Arena
Project Type	Major Project
Application Type	Real-Time Multiplayer Web Application
Domain	Cricket / Sports Technology
Frontend	React + Vite
Styling	Tailwind CSS
Animation	Framer Motion
Authentication	Firebase Authentication
Database	Firebase Firestore + Realtime Database
Deployment	Vercel
Source Control	GitHub
🌐 Project Links
🚀 Live Application

https://ipl-auction-landing.vercel.app/

💻 GitHub Repository

https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING

🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

To contribute:

git clone https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING.git
cd IPL-AUCTION-LANDING
npm install

Create a feature branch:

git checkout -b feature/your-feature

Commit your changes:

git add .
git commit -m "Add your feature"

Push the branch:

git push origin feature/your-feature

Then open a Pull Request on GitHub.

📝 License

This project is developed as an academic/major project.

The project is not affiliated with, endorsed by, or officially connected to the Board of Control for Cricket in India (BCCI), Indian Premier League (IPL), or any IPL franchise.

Use of third-party names, logos, player information, and other assets should comply with their respective rights and licenses.

<div align="center">
🏏 IPL Auction Arena
Build Your Squad. Manage Your Purse. Win The Auction.
<br>

Live Demo:
https://ipl-auction-landing.vercel.app/

<br>

Source Code:
https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING

<br><br>

⭐ If you find the project interesting, consider starring the repository.

</div> ```
