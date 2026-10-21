<div align="center">

<img src="./public/readme-assets/ipl-logo.png" width="120" height="120" alt="IPL Auction Arena Logo">

# 🏏 IPL Auction Arena

### Real-Time Multiplayer IPL Auction & Card Battle Platform

<p>
A web-based IPL auction simulation where friends draft their own franchises
through live bidding, then settle the squads in a shared card battle.
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
- [Auction Formats](#-auction-formats)
- [Auction Completion](#-auction-completion)
- [Private Squad Review](#-private-squad-review)
- [Card Battle](#-card-battle)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Data Model](#-data-model)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Security Model](#-security-model)
- [Testing](#-testing)
- [Known Limitations](#-known-limitations)
- [Future Enhancements](#-future-enhancements)
- [Project Information](#-project-information)
- [License](#-license)

---

# 🎯 Overview

**IPL Auction Arena** is a real-time multiplayer IPL auction simulation developed as a major project.

Participants each take over an IPL franchise, bid for players in a live auction room, and once the auction completes, play a card battle using the squads they actually bought.

The platform combines:

- Real-time bidding with synchronized state across connected users
- Franchise budgets, squad limits, and overseas-player limits
- Automatic auction completion when every franchise is full
- A private squad review before each battle
- A shared, turn-based card battle with hidden picks and timeouts
- Rematches and "start together" navigation for everyone in the room

---

# 🎓 Project Objectives

- Build a real-time multiplayer auction environment.
- Implement secure user authentication with Firebase.
- Let users compete through IPL franchises.
- Validate bids against budgets, squad limits, and overseas limits.
- Keep auction state synchronized across clients.
- Complete the auction automatically once every franchise is full.
- Use only auction-acquired players in the card battle.
- Keep each franchise's squad private during the review phase.
- Run a shared, deterministic card battle with a single authoritative result per round.
- Deploy the application to production.

---

# ✨ Key Features

## 🏏 Real-Time Auction
- Live player auctions with normal and custom bids
- Highest-bidder tracking and synchronized countdown timers
- SOLD / UNSOLD states and a live activity feed
- Admin-controlled auction flow (start, pause, resume)

## 🏢 Franchise Management
- Each user owns one franchise for the room
- Remaining purse, squad count, overseas count, and spend per franchise
- Budget and squad limits enforced on every bid

## 🧩 Auction Validation
- Bids rejected when the squad is full, the overseas quota is reached, or the budget is insufficient
- Warning shown to a franchise that has reached its player limit

## 🏁 Auto-Completion
- The auction ends when every participating franchise has its required number of players
- Completion is claimed atomically so only one client finishes the auction

## 🔐 Authentication
- Firebase Authentication for user identity
- Users are tied to their franchise throughout the room

## 🎨 Interface
- Dark, sports-broadcast style with glassmorphism and Framer Motion animations
- Responsive layouts for laptop and mobile
- Player photos shown on laptop, hidden on mobile to keep the layout tight

---

# 🏆 Auction Formats

| Format | Players per franchise | Card battle size |
|---|---|---|
| Mega | 25 | 25 cards |
| Sprint 11 | 11 | 11 cards |
| Sprint 5 | 5 | 5 cards |

The format is chosen when the room is created. Squad size is controlled by the format; the battle format is chosen separately (see below).

---

# 🏁 Auction Completion

The auction completes when **every participating franchise** holds its required number of players for the chosen format.

- The host's browser checks after each sale and, if all franchises are full (or the player queue is empty), claims completion with a transaction on `room/status`.
- Only one completion can succeed, so duplicate or concurrent checks cannot finish the auction twice.
- After completion, each franchise's validated squad is written to a private node, and a public validation summary is written with no player IDs.

> **Note:** completion runs in the host's browser. If the host closes the tab immediately after the final sale, completion will not run until the host reopens the room. A server-side function would remove this dependency.

---

# 🔒 Private Squad Review

After completion, each franchise sees a **10-second review** of its own squad.

- Each card shows name, role, nationality, matches, runs, wickets, strike rate, average, economy, and the **drafted price**.
- The review reads only the signed-in franchise's own hand.
- Other franchises' cards are never rendered on this screen.

---

# ⚔️ Card Battle

After the review, the battle runs as a shared, turn-based game.

## Format selection
The host chooses one of:

- **Play until cards run out** — the franchise with the most cards collected wins.
- **Best of 5 rounds** — the battle ends after 5 rounds.
- **Best of 10 rounds** — the battle ends after 10 rounds (or sooner if cards run out).

## Round flow
1. The turn holder picks one of their cards and a stat: RUNS, WICKETS, SR, AVG, or ECON.
2. Every other active franchise sees the announced stat and locks in one of their own cards.
3. Picks stay hidden until all franchises have locked in, or the submit timer runs out.
4. All cards are revealed together and compared on the announced stat.
5. Higher wins for RUNS, WICKETS, SR, and AVG. **Lower wins for ECON.**
6. The round winner collects the cards played that round. Played cards leave each franchise's active hand.

## Rules
- A card can be played only once. Collected cards are not playable again.
- **Timeouts:** a turn holder who doesn't pick within 20 seconds has their first active card auto-played with RUNS. A franchise that doesn't lock in within 20 seconds has its first active card auto-submitted.
- **Ties:** when values are equal, the franchise closest to the turn holder in turn order wins. Every client computes the same winner.
- **Duplicate actions** are rejected by the transaction, so rapid clicks or reconnects cannot play a card twice.

## Rematch and start together
- When a battle finishes, any franchise can start a **rematch** with the same squads and format.
- When any franchise clicks **Start Card Game**, every franchise in the room is redirected to the battle automatically.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | Application UI |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router | Page routing |

## Backend / Cloud

| Technology | Purpose |
|---|---|
| Firebase Authentication | User identity |
| Firebase Realtime Database | Live auction state, squads, battle state |
| Cloud Firestore | Auction documents and team records |

## Deployment

| Technology | Purpose |
|---|---|
| Vercel | Production hosting |
| GitHub | Source control |

---

# 🧠 System Architecture

```text
                    ┌─────────────────────┐
                    │   Vercel (React)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Firebase Auth      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
   ┌──────────▼──────────┐          ┌───────────▼──────────┐
   │ Firestore           │          │ Realtime Database    │
   │ auction documents   │          │ live bidding, squads │
   │ team records        │          │ battle state, rules  │
   └─────────────────────┘          └───────────┬──────────┘
                                                │
                                   ┌────────────▼────────────┐
                                   │ Connected franchises    │
                                   │ (each user, own tab)    │
                                   └─────────────────────────┘
```

---

# 🗂️ Data Model

Realtime Database, per auction:

```text
auctions/{auctionId}/
├── room/                 status, auctionType, squadLimit, hostId, players
├── live/                 current player, bid, highest bidder, timer
├── playerOrder/          queue of player indices
├── teams/{team}/         public team record (squad cleared after completion)
├── hands/{uid}/          private squad, readable only by its owner
├── publicSquads/         squads shown after completion
├── validation/           ok flag and errors, no player IDs
├── handSummary/          per-franchise counts
├── battle/               shared card battle state
├── gameStart/            start-together flag
├── messages/             activity feed
└── presence/             online status
```

---

# 📂 Project Structure

```text
IPL-AUCTION-LANDING/
├── public/
│   └── readme-assets/
├── scripts/
├── src/
│   ├── components/
│   │   ├── GameCard.jsx          responsive player card (battle + review)
│   │   └── fantasy/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── AuctionContext.jsx    auction state, completion, hands
│   ├── data/
│   │   └── players.js            player dataset
│   ├── lib/
│   │   └── firebase.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Lobby.jsx
│   │   ├── AuctionRoom.jsx
│   │   ├── AuctionSummary.jsx
│   │   ├── GameRoom.jsx          private review + shared battle
│   │   └── FantasyAdmin.jsx
│   ├── utils/
│   │   ├── cardBattleSquads.js   squad validation for the battle
│   │   └── cardBattle.js         battle rules and transactions
│   ├── App.jsx
│   └── main.jsx
├── database.rules.json
├── firebase.json
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites
- Node.js 18 or later
- npm
- Git
- A Firebase project with Authentication, Realtime Database, and Firestore enabled

## 1. Clone the repository

```bash
git clone https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING.git
cd IPL-AUCTION-LANDING
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Firebase values (see below).

## 4. Run the development server

```bash
npm run dev
```

Open `http://localhost:5173`.

## 5. Build for production

```bash
npm run build
npm run preview
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_ADMIN_EMAIL=your_admin_email
```

> **Never commit the real `.env` file.** Keep `.env` in `.gitignore` and commit only `.env.example`.

---

# 🌐 Deployment

The production build is hosted on **Vercel** and deploys from the GitHub repository.

```text
Local development → git push → GitHub → Vercel build → production
```

Live: https://ipl-auction-landing.vercel.app/

---

# 🔒 Security Model

The database rules restrict what each user can read and write:

- **Private squads:** `hands/{uid}` is readable only by its owner and writable only by the host.
- **Public squads and validation:** readable by signed-in users, writable only by the host.
- **Live auction state:** readable and writable by signed-in users, so bidding works in real time.
- **Presence:** each user can write only their own presence entry.

### Known limitations of the current rules
- **Team records (`teams`) are writable by any signed-in user.** The app's budget and squad checks run in the browser, so a determined user could edit a team's budget or squad. Fixing this requires server-side validation (Cloud Functions), which is not implemented.
- **Bid validation is client-side.** The rules do not check bid amounts, budgets, or squad limits.
- **Completion and battle resolution depend on a connected client.** Transactions prevent duplicate results, but a fully offline room cannot progress.

This project is built for a trusted group of friends. Do not use it for real money or with untrusted users without adding server-side validation.

---

# 🧪 Testing

Manual checks used during development:

**Auction**
- Create and join a room; the lobby lists participants.
- Normal and custom bids update the highest bidder and timer.
- Bids are rejected when the squad is full, the overseas quota is reached, or the budget is insufficient.
- The auction completes automatically when every franchise is full.

**Review and battle**
- Each franchise sees only its own squad during the 10-second review.
- The host chooses the format; the other franchises wait.
- Picks stay hidden until reveal; the round result matches on every client.
- Timeouts resolve the round; ties resolve the same way on every client.
- Refreshing during a battle restores the same state.
- Rematch and "Start Card Game" redirect the room.

---

# ⚠️ Known Limitations

- Auction completion runs in the host's browser.
- Team budgets and squads are not server-validated.
- The player dataset is static; stats must be updated manually.
- The project is an auction simulation and is not an official IPL product.

---

# 🔮 Future Enhancements

- Cloud Functions for server-side bid, budget, and completion validation
- Automatic completion that does not depend on the host's browser
- Richer battle modes and power cards
- Improved mobile layouts for the auction room

These are planned and are not implemented yet.

---

# 👨‍💻 Project Information

| Category | Details |
|---|---|
| Project Name | IPL Auction Arena |
| Project Type | Major Project |
| Application Type | Real-time multiplayer web application |
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Authentication | Firebase Authentication |
| Database | Firebase Realtime Database + Cloud Firestore |
| Deployment | Vercel |
| Source Control | GitHub |

---

# 📝 License

This project is developed as an academic/major project.

It is not affiliated with, endorsed by, or connected to the Board of Control for Cricket in India (BCCI), the Indian Premier League (IPL), or any IPL franchise. Team names, logos, and player information belong to their respective owners.

---

<div align="center">

🏏 **IPL Auction Arena**
*Build your squad. Manage your purse. Battle for the trophy.*

Live Demo: https://ipl-auction-landing.vercel.app/
Source Code: https://github.com/VARUN-BIT9090u8/IPL-AUCTION-LANDING

⭐ If you find the project interesting, consider starring the repository.

</div>
