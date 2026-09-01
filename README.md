# Looop

Looop is a event management website with MCP tools registered, facilitating human and agent collaboration for efficient workflow. 

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