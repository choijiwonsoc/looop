import { createEvent, editEvent, deleteEvent, getTasks, getIssues } from "../api-handlers/event"
import { createTask, editTask, completeTask, deleteTask } from "../api-handlers/task"
import { createIssue, editIssue, resolveIssue, deleteIssue } from "../api-handlers/issue"

export function registerLooopTools() {
    //event tools
    document.modelContext.registerTool({
        name: 'create_event',
        description: 'Create a new event board. If endDate is omitted, the event is treated as ongoing',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                type: { type: 'string', enum: ['wedding', 'party', 'conference', 'household', 'other'] },
                description: { type: 'string', description: "Short description of event'" },
                startDate: { type: 'string', description: 'ISO date, default to current date if none given' },
                endDate: { type: 'string', description: 'ISO date, omit for ongoing events' },

            },
            required: ['name', 'type', 'description', 'startDate']
        },
        execute: async (input) => createEvent(input)
    })

    document.modelContext.registerTool({
        name: 'edit_event',
        description: 'Edit an event type, or dates.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                type: { type: 'string' },
                description: { type: 'string' },
                startDate: { type: 'string' },
                endDate: { type: 'string' },
            },
            required: ['eventId']
        },
        execute: async (input) => editEvent(input)
    })

    document.modelContext.registerTool({
        name: 'delete_event',
        description: 'Delete an event.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
            },
            required: ['eventId']
        },
        execute: async (input) => deleteEvent(input)
    })

    //task tools
    document.modelContext.registerTool({
        name: 'create_task',
        description: 'Add a task to an event board.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                title: { type: 'string' },
                notes: { type: 'string' },
                priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                assignedTo: { type: 'string', description: 'member id, omit to leave unassigned' },
                dueDay: { type: 'number' },
            },
            required: ['eventId', 'title', 'notes', 'priority']
        },
        execute: async (input) => createTask(input)
    })

    document.modelContext.registerTool({
        name: 'edit_task',
        description: 'Edit a task — change its priority, assignee, due day, or notes.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                notes: { type: 'string' },
                priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                assignedTo: { type: 'string' },
                dueDay: { type: 'number' },
            },
            required: ['eventId', 'taskId']
        },
        execute: async (input) => editTask(input)
    })

    document.modelContext.registerTool({
        name: 'complete_task',
        description: 'Mark a task as done (or reopen it).',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
            },
            required: ['eventId', 'taskId', 'status'],
        },
        execute: async (input) => completeTask(input)

    });

    document.modelContext.registerTool({
        name: 'delete_task',
        description: 'Delete a task on an event board.',
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: 'string' },
            },
            required: ['taskId']
        },
        execute: async (input) => deleteTask(input)
    })

    //issue tools
    document.modelContext.registerTool({
        name: 'create_issue',
        description: 'Flag a problem or delay on an event board.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                description: { type: 'string' },
                severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                raisedBy: { type: 'string', description: 'member id of who is flagging it' },
            },
            required: ['eventId', 'description', 'severity']
        },
        execute: async (input) => createIssue(input)
    })

    document.modelContext.registerTool({
        name: 'edit_issue',
        description: 'Edit description or severity of an issue.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
                description: { type: 'string' },
                severity: { type: 'string', enum: ['low', 'medium', 'high'] },
            },
            required: ['eventId', 'issueId']
        },
        execute: async (input) => editIssue(input)
    })

    document.modelContext.registerTool({
        name: 'resolve_issue',
        description: 'Mark a issue as done (or reopen it).',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
                resolved: { type: 'boolean' },
                resolvedBy: { type: 'string', description: 'member id, required when resolving' },
            },
            required: ['eventId', 'taskId', 'resolved'],
        },
        execute: async (input) => resolveIssue(input)

    });

    document.modelContext.registerTool({
        name: 'delete_issue',
        description: 'Delete an issue on an event board.',
        inputSchema: {
            type: 'object',
            properties: {
                issueId: { type: 'string' },
            },
            required: ['issueId']
        },
        execute: async (input) => deleteIssue(input)
    })

    //context and summary
    document.modelContext.registerTool({
        name: 'get_event_summary',
        description: 'Get a compact status summary for an event: task completion count, open urgent tasks, unresolved issues by severity and a overall health score',
        inputSchema: {
            type: 'object',
            properties: { 'eventId': { type: 'string' } },
            required: ['eventId']
        },
        execute: async (input) => {
            // pull from your app's current state instead of a dedicated backend endpoint
            const [tasks, issues] = await Promise.all([
                getTasks(input.eventId),
                getIssues(input.eventId),
            ])

            const urgentOpen = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
            const doneCount = tasks.filter(t => t.status === 'done').length;
            const highIssuesOpen = issues.filter(i => i.severity === 'high' && !i.resolved).length;
            const normalOpen = tasks.filter(t => t.priority === 'normal' && t.status !== 'done').length;

            let health = 100 - urgentOpen * 15 - highIssuesOpen * 20 - normalOpen * 5;
            health = Math.max(0, Math.min(100, health));

            return {
                totalTasks: tasks.length,
                doneCount,
                urgentOpen,
                issuesOpen: issues.filter(i => !i.resolved).length,
                highIssuesOpen,
                healthScore: health,
            };
        },
    })

    document.modelContext.registerTool({
        name: 'generate_starter_tasks',
        description:
            "Generate a sensible starter checklist of tasks for a newly created event, based on its type (wedding, move, conference, etc). Call this right after create_event if the user hasn't specified their own tasks, so they don't start from a blank board.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                tasks: {
                    type: 'array',
                    description: 'The list of starter tasks you are proposing, each with a title and priority.',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                        },
                        required: ['title', 'priority'],
                    },
                },
            },
            required: ['eventId', 'tasks'],
        },
        execute: async (input) => api(`/events/${input.eventId}/tasks/bulk`, 'POST', { tasks: input.tasks }),
    });

    document.modelContext.registerTool({
        name: 'get_recent_changes',
        description: "Get what changed on an event since a given timestamp — use this to catch a user up on what they missed.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                since: { type: 'string', description: 'ISO timestamp' },
            },
            required: ['eventId', 'since'],
        },
        execute: async (input) => api(`/events/${input.eventId}/changes?since=${input.since}`, 'GET'),
    });

    document.modelContext.registerTool({
        name: 'suggest_task_completion',
        description:
            "Suggest concrete next steps for completing a task, and save that suggestion as notes on the task. Use the task's existing title and notes for context, then propose a clear, actionable suggestion.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                suggestion: {
                    type: 'string',
                    description: 'Your concrete, actionable suggestion for how to complete this task.',
                },
            },
            required: ['eventId', 'taskId', 'suggestion'],
        },
        execute: async (input) =>
            api(`/events/${input.eventId}/tasks/${input.taskId}`, 'PATCH', { notes: input.suggestion }),
    });

    document.modelContext.registerTool({
        name: 'suggest_issue_resolution',
        description:
            "Suggest how to resolve a flagged issue, and save that suggestion so anyone viewing the issue can see it. Use the issue's description and severity for context, then propose a clear resolution.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
                suggestion: {
                    type: 'string',
                    description: 'Your concrete, actionable suggestion for how to resolve this issue.',
                },
            },
            required: ['eventId', 'issueId', 'suggestion'],
        },
        execute: async (input) =>
            api(`/events/${input.eventId}/issues/${input.issueId}`, 'PATCH', { suggestedResolution: input.suggestion }),
    });

}