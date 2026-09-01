import { createEvent, editEvent, deleteEvent, getTasks, getIssues } from "../api-handlers/event"
import { createTask, editTask, completeTask, deleteTask } from "../api-handlers/task"
import { createIssue, editIssue, resolveIssue, deleteIssue } from "../api-handlers/issue"

export function registerLooopTools() {
    if (!document.modelContext) {
        console.warn('WebMCP not available in this browser context — skipping tool registration.');
        return;
    }

    //event tools
    document.modelContext.registerTool({
        name: 'create_event',
        description: 'Create a new event board. If endDate is omitted, the event is treated as ongoing',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                type: { type: 'string', enum: ['project', 'party', 'conference', 'household', 'other'] },
                description: { type: 'string', description: "Short description of event" },
                startDate: { type: 'string', description: 'ISO date, default to current date if none given' },
                endDate: { type: 'string', description: 'ISO date, omit for ongoing events' },
                members: {
                    type: 'array',
                    description: 'Initial members on the board',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            color: { type: 'string' },
                        },
                        required: ['id', 'name', 'color'],
                    },
                },
                inviteCode: { type: 'string' },
            },
            required: ['name', 'type', 'description', 'startDate', 'members', 'inviteCode']
        },
        execute: async (input) => createEvent(input)
    })

    document.modelContext.registerTool({
        name: 'edit_event',
        description: 'Edit an event name, type, description, or dates.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                name: { type: 'string' },
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
            properties: { eventId: { type: 'string' } },
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
                startDay: { type: 'string', description: 'ISO date. For a single-day task, set startDay and endDay to the same date.' },
            endDay: { type: 'string', description: 'ISO date. Omit both startDay and endDay for an unscheduled task that shows on every day.' },
            },
            required: ['eventId', 'title', 'priority']
        },
        execute: async (input) => createTask(input)
    })

    document.modelContext.registerTool({
        name: 'edit_task',
        description: 'Edit a task — change its title, priority, assignee, due day, or notes.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                title: { type: 'string' },
                notes: { type: 'string' },
                priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                assignedTo: { type: 'string' },
                startDay: { type: 'string', description: 'ISO date' },
            endDay: { type: 'string', description: 'ISO date' },
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
                eventId: { type: 'string' },
                taskId: { type: 'string' },
            },
            required: ['eventId', 'taskId']
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
            required: ['eventId', 'description', 'severity', 'raisedBy']
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
        description: 'Mark an issue as resolved (or reopen it).',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
                resolved: { type: 'boolean' },
                resolvedBy: { type: 'string', description: 'member id, required when resolving' },
            },
            required: ['eventId', 'issueId', 'resolved'],
        },
        execute: async (input) => resolveIssue(input)
    });

    document.modelContext.registerTool({
        name: 'delete_issue',
        description: 'Delete an issue on an event board.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
            },
            required: ['eventId', 'issueId']
        },
        execute: async (input) => deleteIssue(input)
    })

    //context and summary
    document.modelContext.registerTool({
        name: 'get_event_summary',
        description: 'Get a compact status summary for an event: task completion count, open urgent tasks, unresolved issues by severity and an overall health score',
        inputSchema: {
            type: 'object',
            properties: { eventId: { type: 'string' } },
            required: ['eventId']
        },
        execute: async (input) => {
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
        name: 'suggest_task_completion',
        description:
            "Suggest concrete next steps for completing a task, and save that suggestion on the task. Use the task's existing title and notes for context, then propose a clear, actionable suggestion.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                suggestion: { type: 'string', description: 'Your concrete, actionable suggestion.' },
            },
            required: ['eventId', 'taskId', 'suggestion'],
        },
        execute: async (input) =>
            editTask({ eventId: input.eventId, taskId: input.taskId, followUp: [input.suggestion] }),
    });

    document.modelContext.registerTool({
        name: 'suggest_issue_resolution',
        description:
            "Suggest how to resolve a flagged issue, and save that suggestion on the issue. Use the issue's description and severity for context.",
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                issueId: { type: 'string' },
                suggestion: { type: 'string', description: 'Your concrete, actionable suggestion.' },
            },
            required: ['eventId', 'issueId', 'suggestion'],
        },
        execute: async (input) =>
            editIssue({ eventId: input.eventId, issueId: input.issueId, followUp: [input.suggestion] }),
    });

    // NOT REGISTERED — no backend support yet, would throw at runtime:
    // - generate_starter_tasks: needs a POST /api/events/:id/tasks/bulk handler (doesn't exist)
    // - get_recent_changes: needs a real activity/history endpoint (doesn't exist — HistoryLog
    //   is currently mock-only, see note on EventDetailPage below)
    // Re-add these once those backend pieces exist.
}