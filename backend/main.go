package main

import(
	"encoding/json"
	"log"
	"net/http"
	"github.com/go-chi/cors"
	"github.com/go-chi/chi/v5"
	//"database"
	"handlers"
)

func main(){
	//database.Connect("mongodb+srv://username:password@cluster.mongodb.net/","mydb")
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "DELETE"},
	}))
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request){
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	//events
	r.Post("/api/events", handlers.CreateEvent)
	r.Get("/api/get-events", handlers.GetAllEvents)
	r.Patch("/api/events/{id}", handlers.EditEvent)
	r.Delete("/api/events/{id}", handlers.DeleteEvent)
	r.Get("/events/{eventId}/tasks", GetTasks)
	r.Get("/events/{eventId}/issues", GetIssues)

	//tasks
	r.Post("/api/tasks", handlers.CreateTask)
	r.Get("/api/get-tasks", handlers.GetAllTasks)
	r.Patch("/api/events/{eventId}/tasks/{id}/status", handlers.ResolveTask)
	r.Patch("/api/events/{eventId}/tasks/{id}", handlers.ResolveTask)
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