package handlers

import (
	"context"
	"encoding/json"
	"looop-backend/database"
	"looop-backend/models"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// logHistory is best-effort: a logging failure should never fail the
// actual mutation it's describing, so errors are swallowed here.
func logHistory(eventID primitive.ObjectID, actorID string, action models.HistoryAction, targetLabel string) {
	if actorID == "" {
		actorID = "unknown"
	}
	entry := models.HistoryEntry{
		ID:          primitive.NewObjectID(),
		EventID:     eventID,
		ActorID:     actorID,
		Action:      action,
		TargetLabel: targetLabel,
		Timestamp:   time.Now(),
	}
	database.DB.Collection("history").InsertOne(context.Background(), entry)
}

func GetHistory(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventId")
	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("history")
	cursor, err := collection.Find(context.Background(), bson.M{"eventId": objectID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var entries []models.HistoryEntry
	if err := cursor.All(context.Background(), &entries); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if entries == nil {
		entries = []models.HistoryEntry{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}
