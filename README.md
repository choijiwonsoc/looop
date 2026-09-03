# Looop

Looop is a event management website with MCP tools registered, facilitating human and agent collaboration for efficient workflow. 
Looop gives every event (wedding party, offsite, household chore chart) one shared board, which includes tasks grouped by urgency, flagged issues for attention, day-by-day timeline and a computed event health score. The core actions on the board such as creating and editing tasks, flagging and resolving issues, are exposed as MCP tools. Users can simply ask their agent "What tasks are still open on the wedding board?" or "Add an urgent task for the caterer" or "Flag that the venue has not confirmed headcount". The agent can even act as a collaborator, proposing **concrete next steps for a stuck task or open issue**, as well as **starter tasks for event based on its title and description**, and providing a **concise summary of the event history**.

## Architecture

Frontend:
- TypeScript
- React
- Vite

Backend:
- Go

Database:
- MongoDB

## Prerequisites

- Node.js 18+
- npm
- Go 1.22+

## Setup

### Backend

Navigate to the backend directory:

```bash
cd backend
go mod tidy
go run main.go
```
The backend will start on localhost:8080

### Frontend

Open a new terminal

```bash
cd frontend
npm install
npm run dev
```
The frontend webpage will start on http://localhost:5173
