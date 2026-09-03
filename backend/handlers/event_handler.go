package handlers

import (
	"context"
	"encoding/json"
	"looop-backend/database"
	"looop-backend/models"
	"net/http"
	"time"
	"crypto/rand"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func generateInviteCode() string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no ambiguous 0/O/1/I
	b := make([]byte, 6)
	rand.Read(b)
	for i := range b {
		b[i] = chars[int(b[i])%len(chars)]
	}
	return "LOOP-" + string(b)
}


func CreateEvent(w http.ResponseWriter, r *http.Request) {
	var event models.Event

	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	event.ID = primitive.NewObjectID()
	event.CreatedAt = time.Now()
	event.InviteCode = generateInviteCode()

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
	memberId := r.URL.Query().Get("memberId")
	filter := bson.M{}
	if memberId != "" {
		filter = bson.M{"members.id": memberId}
	}
	collection := database.DB.Collection("events")
	cursor, err := collection.Find(
		context.Background(),
		filter,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	events := make([]models.Event, 0)
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

	tasks := make([]models.Task, 0)
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

	issues := make([]models.Issue, 0)
	if err := cursor.All(context.Background(), &issues); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}

type JoinEventRequest struct {
	InviteCode string        `json:"inviteCode"`
	Member     models.Member `json:"member"`
}

func JoinEvent(w http.ResponseWriter, r *http.Request) {
	var req JoinEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("events")
	var event models.Event
	err := collection.FindOne(context.Background(), bson.M{"inviteCode": req.InviteCode}).Decode(&event)
	if err != nil {
		http.Error(w, "Invite code not found", http.StatusNotFound)
		return
	}

	alreadyMember := false
	for _, m := range event.Members {
		if m.ID == req.Member.ID {
			alreadyMember = true
			break
		}
	}

	if !alreadyMember {
		_, err = collection.UpdateOne(
			context.Background(),
			bson.M{"_id": event.ID},
			bson.M{"$push": bson.M{"members": req.Member}},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		event.Members = append(event.Members, req.Member)
		logHistory(event.ID, req.Member.ID, models.ActionMemberJoined, req.Member.Name+" joined")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

func GetMembers(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventId")

	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("events")

	var event models.Event
	err = collection.FindOne(
		context.Background(),
		bson.M{"_id": objectID},
	).Decode(&event)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Event not found", http.StatusNotFound)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event.Members)
}