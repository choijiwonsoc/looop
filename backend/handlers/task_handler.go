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

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task

	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	task.ID = primitive.NewObjectID()
	task.Status = models.TaskStatusTodo // always start as todo, ignore any client value
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	collection := database.DB.Collection("tasks")
	result, err := collection.InsertOne(
		context.Background(),
		task,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	logHistory(task.EventID, *task.AssignedTo, models.ActionTaskCreated, task.Title)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func getTaskRef(objectID primitive.ObjectID) (eventID primitive.ObjectID, title string, ok bool) {
	var task models.Task
	err := database.DB.Collection("tasks").FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&task)
	if err != nil {
		return primitive.NilObjectID, "", false
	}
	return task.EventID, task.Title, true
}

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	collection := database.DB.Collection("tasks")
	cursor, err := collection.Find(
		context.Background(),
		bson.M{},
	)
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

func CompleteTask(w http.ResponseWriter, r *http.Request) {
	taskID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}
	var req models.CompleteTaskRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	eventID, title, ok := getTaskRef(objectID)

	collection := database.DB.Collection("tasks")
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"status": req.Status, "followUp": req.FollowUp}},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if ok {
		action := models.ActionTaskStatusChanged
		if req.Status == string(models.TaskStatusDone) {
			action = models.ActionTaskCompleted
		}
		logHistory(eventID, req.ActorID, action, title)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Task resolved",
		"taskId":  taskID,
	})
}

func EditTask(w http.ResponseWriter, r *http.Request) {
	taskID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	var req models.EditTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Build the $set doc dynamically — only include fields that were actually sent
	setFields := bson.M{}
	if req.Title != nil {
		setFields["title"] = *req.Title
	}
	if req.Notes != nil {
		setFields["notes"] = *req.Notes
	}
	if req.Priority != nil {
		setFields["priority"] = *req.Priority
	}
	if req.AssignedTo != nil {
		setFields["assignedTo"] = *req.AssignedTo
	}
	if req.StartDay != nil {
		setFields["startDay"] = *req.StartDay
	}
	if req.EndDay != nil {
		setFields["endDay"] = *req.EndDay
	}
	if len(req.FollowUp) > 0 {
		setFields["followUp"] = req.FollowUp
	}

	// if len(setFields) == 0 {
	// 	http.Error(w, "No fields to update", http.StatusBadRequest)
	// 	return
	// }

	eventID, existingTitle, ok := getTaskRef(objectID)

	collection := database.DB.Collection("tasks")
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
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if ok {
		label := existingTitle
		if req.Title != nil {
			label = *req.Title
		}
		logHistory(eventID, req.ActorID, models.ActionTaskEdited, label)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "task updated",
		"taskId":  taskID,
	})
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	taskID := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}
	actorID := r.URL.Query().Get("actorId")

	eventID, title, ok := getTaskRef(objectID)

	collection := database.DB.Collection("tasks")
	result, err := collection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.DeletedCount == 0 {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if ok {
		logHistory(eventID, actorID, models.ActionTaskDeleted, title)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "task deleted",
		"taskId":  taskID,
	})
}
