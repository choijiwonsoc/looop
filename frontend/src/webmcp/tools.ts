/**
 * WebMCP tool registration.
 *
 * This is where document.modelContext.registerTool() calls go, once the
 * backend API is wired up. Each tool's execute() should call the matching
 * backend endpoint (see README for the planned tool list).
 *
 * Import and call a setup function like registerLooopTools() from App.tsx
 * (or a top-level effect) once this is implemented.
 *
 * Example shape:
 *
 * document.modelContext.registerTool({
 *   name: "add_task",
 *   description: "Add a task to an event's board",
 *   inputSchema: {
 *     type: "object",
 *     properties: {
 *       eventId: { type: "string" },
 *       title: { type: "string" },
 *       priority: { type: "string", enum: ["urgent", "normal", "optional"] },
 *       dueDay: { type: "number" },
 *     },
 *     required: ["eventId", "title", "priority"],
 *   },
 *   execute: async (input) => {
 *     const res = await fetch(`/api/events/${input.eventId}/tasks`, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(input),
 *     });
 *     return await res.json();
 *   },
 * });
 */

export {};
