<div align="center">

<img src="./public/readme-assets/ipl-logo.png" width="120" height="120" alt="IPL Auction Logo">

# 🏏 IPL Auction Arena

### Real-Time Multiplayer IPL Auction & Fantasy Simulation Platform

A full-stack interactive IPL auction simulation platform designed to recreate the experience of a professional cricket auction with real-time multiplayer bidding, team management, live auction synchronization, and a fantasy scoring arena.

<br>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br>

**🏏 Live Auction • ⚡ Real-Time Multiplayer • 💰 Dynamic Bidding • 🏆 Fantasy Arena**

</div>

---

## 🌐 Live Application

🚀 **Live Demo:**  
**[Add your Vercel URL here]**

> The application is deployed using Vercel and uses Firebase services for authentication, database synchronization, and real-time auction state management.

---

# 📌 Project Overview

**IPL Auction Arena** is a real-time multiplayer IPL auction simulation system that allows multiple users to participate in the same auction room.

Each participant manages an IPL franchise with a predefined budget and squad limitations. Players are introduced into the auction one at a time, and participants compete through real-time bidding.

The system synchronizes auction state across connected clients using Firebase Realtime Database, allowing participants to see bid changes, timers, team budgets, and auction activity without manually refreshing the page.

After the auction, users can use their acquired players to build fantasy teams and participate in the Fantasy Arena.

---

# 🎯 Project Objectives

The primary objectives of the project are:

- To develop a real-time multiplayer IPL auction simulation.
- To synchronize bidding activity between multiple users.
- To implement secure user authentication.
- To provide franchise-based budget and squad management.
- To implement dynamic player bidding and auction timers.
- To support different auction formats.
- To provide live auction activity and communication.
- To allow users to construct fantasy teams from auction acquisitions.
- To calculate fantasy performance using match statistics.
- To provide a modern, responsive and interactive user interface.

---

# ✨ Key Features

## 🏏 Real-Time Auction Engine

The auction engine is the core component of the platform.

### Features

- Real-time multiplayer bidding.
- Live auction rooms.
- Automatic bid synchronization.
- Auction countdown timer.
- Highest-bidder tracking.
- SOLD / UNSOLD player handling.
- Auction pause and resume functionality.
- Admin-controlled auction flow.
- Live auction activity logs.
- Automatic budget updates.
- Squad-size restrictions.
- Overseas-player restrictions.

---

## 💰 Dynamic Bidding System

The platform supports dynamic player bidding during an active auction.

Participants can:

- Place the next valid bid.
- See the current highest bid.
- See the current highest bidder.
- Track the remaining auction timer.
- Automatically update their available budget.
- Compete against multiple participants in real time.

The auction system validates bids against:

- Current auction state.
- Current highest bidder.
- Team budget.
- Squad limit.
- Overseas-player limit.
- Player availability.

---

## 🎯 Custom Bid Interface

The auction interface is designed to support more flexible bidding interactions.

Users can select a desired bid amount rather than being limited to repeatedly clicking a standard increment button.

This provides a more realistic auction experience, particularly when a participant wants to aggressively bid for a priority player.

Example:

```text
Current Bid
₹3.00 Cr

Custom Bid
₹10.00 Cr

[ PLACE BID ]
