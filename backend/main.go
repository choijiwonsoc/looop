package main

import (
	"encoding/json"
	"log"
	"looop-backend/database"
	"looop-backend/handlers"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	mongoDB := os.Getenv("MONGODB_DATABASE")

	database.Connect(mongoURI, mongoDB)
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "DELETE"},
	}))
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Server is running!",
		})
	})

	//events
	r.Post("/api/events", handlers.CreateEvent)
	r.Get("/api/get-events", handlers.GetAllEvents)
	r.Patch("/api/events/{id}", handlers.EditEvent)
	r.Delete("/api/events/{id}", handlers.DeleteEvent)
	r.Get("/events/{eventId}/tasks", handlers.GetTasks)
	r.Get("/events/{eventId}/issues", handlers.GetIssues)

	//tasks
	r.Post("/api/tasks", handlers.CreateTask)
	r.Get("/api/get-tasks", handlers.GetAllTasks)
	r.Patch("/api/events/{eventId}/tasks/{id}/status", handlers.CompleteTask)
	r.Patch("/api/events/{eventId}/tasks/{id}", handlers.EditTask)
	r.Delete("/api/events/{eventId}/tasks/{id}", handlers.DeleteTask)

	//issues
	r.Post("/api/issues", handlers.CreateIssue)
	r.Get("/api/get-issues", handlers.GetAllIssues)
	r.Patch("/api/events/{eventId}/issues/{id}/status", handlers.ResolveIssue)
	r.Patch("/api/events/{eventId}/issues/{id}", handlers.EditIssue)
	r.Delete("/api/events/{eventId}/issues/{id}", handlers.DeleteIssue)

	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}
