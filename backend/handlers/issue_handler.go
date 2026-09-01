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

func CreateIssue(w http.ResponseWriter, r *http.Request) {
	var issue models.Issue

	if err := json.NewDecoder(r.Body).Decode(&issue); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	issue.ID = primitive.NewObjectID()
	issue.Resolved = false // always start unresolved, ignore any client value
	issue.CreatedAt = time.Now()
	collection := database.DB.Collection("issues")
	result, err := collection.InsertOne(
		context.Background(),
		issue,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func GetAllIssues(w http.ResponseWriter, r *http.Request) {
	collection := database.DB.Collection("issues")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
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

func ResolveIssue(w http.ResponseWriter, r *http.Request) {
	issueID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(issueID)
	if err != nil {
		http.Error(w, "Invalid issue ID", http.StatusBadRequest)
		return
	}
	var req models.ResolveIssueRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	collection := database.DB.Collection("issues")
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{
			"resolved":   req.Resolved,
			"resolvedBy": req.ResolvedBy,
			"followUp":   req.FollowUp,
		}},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "issue not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "issue resolved",
		"issueId": issueID,
	})
}

func EditIssue(w http.ResponseWriter, r *http.Request) {
	issueID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(issueID)
	if err != nil {
		http.Error(w, "Invalid issue ID", http.StatusBadRequest)
		return
	}

	var req models.EditIssueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Build the $set doc dynamically — only include fields that were actually sent
	setFields := bson.M{}
	if req.Description != nil {
		setFields["description"] = *req.Description
	}
	if req.Severity != nil {
		setFields["severity"] = *req.Severity
	}
	if len(req.FollowUp) > 0 {
		setFields["followUp"] = req.FollowUp
	}

	// if len(setFields) == 0 {
	// 	http.Error(w, "No fields to update", http.StatusBadRequest)
	// 	return
	// }

	collection := database.DB.Collection("issues")
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
		http.Error(w, "issue not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "issue updated",
		"issueId": issueID,
	})
}

func DeleteIssue(w http.ResponseWriter, r *http.Request) {
	issueID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(issueID)
	if err != nil {
		http.Error(w, "Invalid issue ID", http.StatusBadRequest)
		return
	}

	collection := database.DB.Collection("issues")
	result, err := collection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.DeletedCount == 0 {
		http.Error(w, "issue not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "issue deleted",
		"issueId": issueID,
	})
}
