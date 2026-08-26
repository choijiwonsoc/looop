package main

import(
	"encoding/json"
	"log"
	"net/http"
	"github.com/go-chi/cors"
	"github.com/go-chi/chi/v5"
)

func main(){
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "DELETE"},
	}))
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request){
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}