# Team Rocket: AI-Based Smart Load Matching System

## Problem Statement
Small trucking and logistics businesses in India often depend on manual processes such as WhatsApp groups and phone calls to match cargo with available trucks. This approach is inefficient and frequently results in trucks operating below their full capacity, leading to unnecessary fuel consumption, higher operating costs, and reduced profit margins for fleet owners.

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

## Setup Instructions

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Modular Architecture
The solution is divided into distinct modules:
- `app/services`: Contains the AI logic (Matching, Routing, Load Optimization).
- `app/api`: Handles HTTP requests.
- `app/models`: Defines Database Schema.
- `frontend/src`: Component-based UI.