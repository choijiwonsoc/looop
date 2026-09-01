package handlers

import (
	"context"
	"encoding/json"
	"looop-backend/database"
	"looop-backend/models"
	"net/http"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateEvent(w http.ResponseWriter, r *http.Request) {
	var event models.Event

	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	event.ID = primitive.NewObjectID()
	event.CreatedAt = time.Now()

	collection := database.DB.Collection("events")
	result, err := collection.InsertOne(
		context.Background(),
		event,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func GetAllEvents(w http.ResponseWriter, r *http.Request) {
	collection := database.DB.Collection("events")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	var events []models.Event
	if err := cursor.All(context.Background(), &events); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

func EditEvent(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	var req models.EditEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Build the $set doc dynamically — only include fields that were actually sent
	setFields := bson.M{}
	if req.Name != nil {
		setFields["name"] = *req.Name
	}
	if req.Type != nil {
		setFields["type"] = *req.Type
	}
	if req.Description != nil {
		setFields["description"] = *req.Description
	}
	if req.StartDate != nil {
		setFields["startDate"] = *req.StartDate
	}
	if req.EndDate != nil {
		setFields["endDate"] = *req.EndDate
	}

	// if len(setFields) == 0 {
	// 	http.Error(w, "No fields to update", http.StatusBadRequest)
	// 	return
	// }

	collection := database.DB.Collection("events")
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": setFields},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "event not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "event updated",
		"eventId": eventID,
	})
}

func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("events")
	result, err := collection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.DeletedCount == 0 {
		http.Error(w, "event not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "event deleted",
		"eventID": eventID,
	})
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventId")
	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("tasks")
	cursor, err := collection.Find(context.Background(), bson.M{"eventId": objectID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var tasks []models.Task
	if err := cursor.All(context.Background(), &tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func GetIssues(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventId")
	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("issues")
	cursor, err := collection.Find(context.Background(), bson.M{"eventId": objectID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var issues []models.Issue
	if err := cursor.All(context.Background(), &issues); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}
