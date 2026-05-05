# Team Rocket: AI-Based Smart Load Matching System

## Problem Statement
Imagine you're a factory owner in Mumbai. You have 10 tons of goods that need to reach Bangalore by Friday. What do you do today?
You post on a WhatsApp group. You wait. You call 5 different truck owners. You negotiate rates over the phone. Maybe by Wednesday you find a truck — but it's only half full because the driver couldn't find more cargo on the same route. The driver loses money on the empty space. You paid more than you should have. Everyone loses a little.
This is how 90% of small trucking businesses in India operate right now.

## Solution
An AI-driven solution that intelligently matches cargo loads with trucks by analyzing factors like route, weight, capacity, and delivery schedules. 

### Key Features
- **AI-based cargo–truck matching:** Analyzes route, weight, capacity, and deadlines.
- **3D Load Optimization:** Ensures maximum space utilization (Bin Packing).
- **Route Optimization:** Multi-drop planning and delivery sequence.
- **Shared Loads:** Supports partial loads (multiple cargos in one truck).
- **Dynamic Additions:** Allows mid-route cargo additions if capacity is available.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** SQLAlchemy (SQLite/PostgreSQL)
- **AI:** Custom Heuristics + Ready for Google OR-Tools

## How to use?
See our product : https://translwebapp.netlify.app/

## Modular Architecture
The solution is divided into distinct modules:
- `app/services`: Contains the AI logic (Matching, Routing, Load Optimization).
- `app/api`: Handles HTTP requests.
- `app/models`: Defines Database Schema.
- `frontend/src`: Component-based UI.
