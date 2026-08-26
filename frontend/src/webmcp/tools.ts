import { createEvent } from "../api"

export function registerLooopTools() {
    //event tools
    document.modelContext.registerTool({
        name: 'create_event',
        description: 'Create a new event board. If endDate is omitted, the event is treated as ongoing',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                type: { type: 'string', description: "e.g. 'wedding', 'conference', 'household'" },
                startDate: { type: 'string', description: 'ISO date' },
                endDate: { type: 'string', description: 'ISO date, omit for ongoing events' }

            },
            required: ['name', 'startDate']
        },
        execute: async (input) => createEvent(input)
    })

    document.modelContext.registerTool({
        name: 'edit_event',
        description: 'Edit an event name, type, or dates.',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string' },
                startDate: { type: 'string' },
                endDate: { type: 'string' },
            },
            required: ['eventId']
        },
        execute: async (input) => editEvent(input)
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
                priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                assignedTo: { type: 'string', description: 'member id, omit to leave unassigned' },
                dueDay: { type: 'number' },
                notes: { type: 'string' },
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
                priority: { type: 'string', enum: ['urgent', 'normal', 'optional'] },
                assignedTo: { type: 'string' },
                dueDay: { type: 'number' },
                notes: { type: 'string' },
            },
            required: ['eventId', 'taskId']
        },
        execute: async (input) => editTask(input)
    })

    document.modelContext.registerTool({
        name: 'resolve_task',
        description: 'Mark a task as done (or reopen it).',
        inputSchema: {
            type: 'object',
            properties: {
                eventId: { type: 'string' },
                taskId: { type: 'string' },
                done: { type: 'boolean', description: 'true to complete, false to reopen' },
            },
            required: ['eventId', 'taskId', 'done'],
        },
        execute: async (input) => resolveTask(input)

    });

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
            const tasks = getTasksForEvent(input.eventId);   // however you access current state
            const issues = getIssuesForEvent(input.eventId);

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

}