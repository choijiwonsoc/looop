package handlers

import (
	"context"
	"log"
	"net/http"
	"database"
	"models"
)

func CreateIssue(w http.ResponseWriter, r *http.Request){
	var issue models.issue

	if err := json.NewDecoder(r.body).Decode(&issue); err != nil{
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := database.DB.Collection("issues")
	result, err := collection.InsertOne(
		context.Background(),
		issue,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatisInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}

func GetAllIssues(w http.ResponseWriter, r *http.Request){
	collection := database.DB.Collection("issues")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
	if err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	var issues []models.issue
	if err := cursor.All(context.Background(), &issues); err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(issues)
}

func ResolveTask(w http.ResponseWriter, r *http.Request){
	taskID:= chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil{
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}
	collection := database.DB.Collection("tasks")
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"resolved": true}}
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatisInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":"Task resolved",
		"taskId": taskID
	})
}