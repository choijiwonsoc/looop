package handlers

import (
	"context"
	"log"
	"net/http"
	"database"
	"models"
)

func CreateTask(w http.ResponseWriter, r *http.Request){
	var task models.task

	if err := json.NewDecoder(r.body).Decode(&task); err != nil{
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := database.DB.Collection("tasks")
	result, err := collection.InsertOne(
		context.Background(),
		task,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatisInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}

func GetAllTasks(w http.ResponseWriter, r *http.Request){
	collection := database.DB.Collection("tasks")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
	if err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	defer cursor.Close(context.Background())
	var tasks []models.task
	if err := cursor.All(context.Background(), &tasks); err != nil {
		http.Error(w, err.Error(), http.InternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

