package handlers

import (
	"context"
	"log"
	"net/http"
	"database"
	"models"
)

func CreateEvent(w http.ResponseWriter, r *http.Request){
	var event models.event

	if err := json.NewDecoder(r.body).Decode(&event); err != nil{
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := database.DB.Collection("events")
	result, err := collection.InsertOne(
		context.Background(),
		event,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatisInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}

func GetAllEvents(w http.ResponseWriter, r *http.Request){
	collection := database.DB.Collection("events")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
	if err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	var events []models.event
	if err := cursor.All(context.Background(), &events); err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}