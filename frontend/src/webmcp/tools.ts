import {
  createEvent,
  editEvent,
  deleteEvent,
  getTasks,
  getIssues,
  getEvents,
} from "../api-handlers/event";
import {
  createTask,
  editTask,
  completeTask,
  deleteTask,
} from "../api-handlers/task";
import {
  createIssue,
  editIssue,
  resolveIssue,
  deleteIssue,
} from "../api-handlers/issue";
import {
  resolveEventId,
  resolveTaskId,
  resolveIssueId,
  resolveMemberId,
} from "./resolvers";
import { getIdentity } from "../identity";
import { getHistory } from "../api-handlers/history";

export function registerLooopTools() {
  if (!document.modelContext) {
    console.warn(
      "WebMCP not available in this browser context — skipping tool registration.",
    );
    return;
  }

  document.modelContext.registerTool({
    name: "list_events",
    description:
      "List all events with their id, name, type, and dates. Call this whenever you need an event's id and only know its name.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      const member = getIdentity();
      const events = await getEvents(member.id);
      return events.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        startDate: e.startDate,
        endDate: e.endDate,
      }));
    },
  });

  //event tools
  document.modelContext.registerTool({
    name: "create_event",
    description:
      "Create a new event board. If endDate is omitted, the event is treated as ongoing",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        type: {
          type: "string",
          enum: ["project", "party", "conference", "household", "other"],
        },
        description: {
          type: "string",
          description: "Short description of event",
        },
        startDate: {
          type: "string",
          description: "ISO date, default to current date if none given",
        },
        endDate: {
          type: ["string", "null"],
          description:
            "ISO date the event ends. Set to null if the event is ongoing/has no end date. " +
            "Do not guess — if this isn't clear from context, ask the user whether the event has an end date before calling this tool.",
        },
      },
      required: ["name", "type", "description", "startDate", "endDate"],
    },
    execute: async (input) => {
      const member = getIdentity();
      const created = await createEvent({
        ...input,
        members: [member],
        inviteCode: "",
      });
      setTimeout(() => {
        window.location.reload();
      }, 300);
      return created;
    },
  });

  document.modelContext.registerTool({
    name: "edit_event",
    description:
      "Edit an event name, type, description, or dates.Identify the event with eventId if known, otherwise eventName — call list_events first if you are not sure of either.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: {
          type: "string",
          description:
            "The event's name — used to look up its id if eventId isn't known.",
        },
        name: { type: "string" },
        type: { type: "string" },
        description: { type: "string" },
        startDate: { type: "string" },
        endDate: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const result = await editEvent({ ...input, eventId });
      return result;
    },
  });

  document.modelContext.registerTool({
    name: "delete_event",
    description:
      "Delete an event. Identify it with eventId if known, otherwise eventName.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const result = await deleteEvent({ eventId });
      return result;
    },
  });

  //task tools
  document.modelContext.registerTool({
    name: "create_task",
    description:
      "Add a task to an event board. Identify the event with eventId if known, otherwise eventName.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        title: { type: "string" },
        notes: { type: "string" },
        priority: { type: "string", enum: ["urgent", "normal", "optional"] },
        assignedTo: {
          type: "string",
          description: "member to assign task to, optional",
        },
        startDay: {
          type: "string",
          description: "ISO date.",
        },
        endDay: {
          type: "string",
          description: "ISO date.",
        },
      },
      required: ["title", "notes", "priority", "startDay", "endDay"],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const member = getIdentity();
      let assignedTo = member.id;
      if (input.assignedTo != null) {
        assignedTo = await resolveMemberId(eventId, {
          memberName: input.assignedTo,
        });
      }
      const created = await createTask({ ...input, eventId, assignedTo });
      setTimeout(() => {
        window.location.reload();
      }, 300);
      return created;
    },
  });

  document.modelContext.registerTool({
    name: "edit_task",
    description:
      "Edit a task — change its title, priority, assignee, due day, or notes. Identify the event with eventId/eventName, and the task with taskId if known, otherwise taskTitle.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        taskId: { type: "string" },
        taskTitle: {
          type: "string",
          description:
            "The task's current title — used to look it up if taskId isn't known.",
        },
        title: { type: "string" },
        notes: { type: "string" },
        priority: { type: "string", enum: ["urgent", "normal", "optional"] },
        assignedTo: { type: "string" },
        startDay: { type: "string" },
        endDay: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const taskId = await resolveTaskId(eventId, input);
      const member = getIdentity();
      const result = await editTask({
        ...input,
        eventId,
        taskId,
        actorId: member.id,
      });
      return result;
    },
  });

  document.modelContext.registerTool({
    name: "complete_task",
    description:
      "Mark a task as done (or reopen it). Identify the event with eventId/eventName, and the task with taskId if known, otherwise taskTitle.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        taskId: { type: "string" },
        taskTitle: { type: "string" },
        status: { type: "string", enum: ["todo", "in_progress", "done"] },
      },
      required: ["taskTitle", "status"],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const taskId = await resolveTaskId(eventId, input);
      const member = getIdentity();
      const result = await completeTask({
        eventId,
        taskId,
        status: input.status,
        actorId: member.id,
      });
      return result;
    },
  });

  document.modelContext.registerTool({
    name: "delete_task",
    description:
      "Delete a task on an event board. Identify the event with eventId/eventName, and the task with taskId if known, otherwise taskTitle.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        taskId: { type: "string" },
        taskTitle: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const taskId = await resolveTaskId(eventId, input);
      const member = getIdentity();
      const result = await deleteTask({ eventId, taskId, actorId: member.id });
      return result;
    },
  });

  //issue tools
  document.modelContext.registerTool({
    name: "create_issue",
    description:
      "Flag a problem or delay on an event board.  Identify the event with eventId if known, otherwise eventName.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        description: { type: "string" },
        severity: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["description", "severity"],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const member = getIdentity();
      const created = await createIssue({
        eventId,
        description: input.description,
        severity: input.severity,
        raisedBy: member.id,
      });
      setTimeout(() => {
        window.location.reload();
      }, 300);
      return created;
    },
  });

  document.modelContext.registerTool({
    name: "edit_issue",
    description:
      "Edit description or severity of an issue. Identify the event with eventId/eventName, and the issue with issueId if known, otherwise issueDescription.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        issueId: { type: "string" },
        issueDescription: {
          type: "string",
          description:
            "The issue's current description — used to look it up if issueId isn't known.",
        },
        description: { type: "string" },
        severity: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const issueId = await resolveIssueId(eventId, input);
      const member = getIdentity();
      const result = await editIssue({
        eventId,
        issueId,
        description: input.description,
        severity: input.severity,
        actorId: member.id,
      });
      return result;
    },
  });

  document.modelContext.registerTool({
    name: "resolve_issue",
    description:
      "Mark an issue as resolved (or reopen it).  Identify the event with eventId/eventName, and the issue with issueId if known, otherwise issueDescription.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        issueId: { type: "string" },
        issueDescription: { type: "string" },
        resolved: { type: "boolean" },
      },
      required: ["resolved"],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const issueId = await resolveIssueId(eventId, input);
      const member = getIdentity();
      const result = await resolveIssue({
        eventId,
        issueId,
        resolved: input.resolved,
        resolvedBy: member.id,
      });
      return result;
    },
  });

  document.modelContext.registerTool({
    name: "delete_issue",
    description:
      "Delete an issue on an event board. Identify the event with eventId/eventName, and the issue with issueId if known, otherwise issueDescription.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        issueId: { type: "string" },
        issueDescription: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const issueId = await resolveIssueId(eventId, input);
      const member = getIdentity();
      const result = await deleteIssue({
        eventId,
        issueId,
        actorId: member.id,
      });
      return result;
    },
  });

  //context and summary
  document.modelContext.registerTool({
    name: "get_event_summary",
    description:
      "Get a compact, read-only status summary for an event, including task completion, open urgent tasks, unresolved issues by severity, an overall health score and history of logs for the event. This tool does not modify anything. Identify the event with eventId if known, otherwise eventName.",

    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
      },
      required: [],
    },

    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const [tasks, issues] = await Promise.all([
        getTasks(eventId),
        getIssues(eventId),
      ]);

      const urgentOpen = tasks.filter(
        (t) => t.priority === "urgent" && t.status !== "done",
      ).length;
      const doneCount = tasks.filter((t) => t.status === "done").length;
      const highIssuesOpen = issues.filter(
        (i) => i.severity === "high" && !i.resolved,
      ).length;
      const normalOpen = tasks.filter(
        (t) => t.priority === "normal" && t.status !== "done",
      ).length;

      let health = 100 - urgentOpen * 15 - highIssuesOpen * 20 - normalOpen * 5;
      health = Math.max(0, Math.min(100, health));

      const history = await getHistory(eventId);

      return {
        totalTasks: tasks.length,
        doneCount,
        urgentOpen,
        issuesOpen: issues.filter((i) => !i.resolved).length,
        highIssuesOpen,
        healthScore: health,
        history: history,
      };
    },
  });

  document.modelContext.registerTool({
    name: "suggest_task_completion",

    description:
      "Suggest concrete next steps for completing a task. This is a read-only tool and MUST NOT modify the task or save the suggestion. Use the task's existing title, notes, status, and priority as context. Return a clear, actionable suggestion that the AI can present to the user. If they want it saved, call edit_task with followUp set to your suggestion.",

    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        taskId: { type: "string" },
        taskTitle: { type: "string" },
      },
      required: [],
    },

    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const taskId = await resolveTaskId(eventId, input);
      const tasks = await getTasks(eventId);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Task not found.");

      return {
        eventId,
        taskId: task.id,
        title: task.title,
        notes: task.notes ?? "",
        status: task.status,
        priority: task.priority,
        instruction:
          "Use this context to propose a concrete, actionable next step. Do not modify the task yourself — if the user wants the suggestion saved, call edit_task with followUp: [your suggestion].",
      };
    },
  });

  document.modelContext.registerTool({
    name: "suggest_issue_resolution",

    description:
      "Get context for suggesting how to resolve a flagged issue. This is READ-ONLY — it does not modify the issue. Use the returned description and severity to formulate a clear resolution. If the user wants it saved, call edit_issue with followUp set to your suggestion.",

    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
        issueId: { type: "string" },
        issueDescription: { type: "string" },
      },
      required: [],
    },

    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const issueId = await resolveIssueId(eventId, input);
      const issues = await getIssues(eventId);
      const issue = issues.find((i) => i.id === issueId);
      if (!issue) throw new Error("Issue not found.");

      return {
        eventId,
        issueId: issue.id,
        description: issue.description,
        severity: issue.severity,
        resolved: issue.resolved,
        instruction:
          "Use this context to propose a concrete resolution. Do not modify the issue yourself — if the user wants the suggestion saved, call edit_issue with followUp: [your suggestion].",
      };
    },
  });

  document.modelContext.registerTool({
    name: "generate_starter_task_suggestions",
    description:
      "Get context for suggesting a starter checklist of tasks for an event, based on its type and description. This is READ-ONLY — it does not create or modify any tasks. Present the suggested tasks to the user first. Only create tasks after the user explicitly asks to add them, by calling create_task once per task they approve.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const member = getIdentity();
      const events = await getEvents(member.id);
      const event = events.find((e) => e.id === eventId);
      if (!event) throw new Error("Event not found.");

      return {
        eventId: event.id,
        eventName: event.name,
        eventType: event.type ?? "",
        description: event.description ?? "",
        startDate: event.startDate,
        endDate: event.endDate,
        instruction:
          "Generate a sensible starter checklist based on the event type, description, and dates. Return suggested tasks only — each with a title and priority (urgent/normal/optional). Do not create anything yourself. If the user approves some or all of them, call create_task once per approved task.",
      };
    },
  });

  document.modelContext.registerTool({
    name: "get_next_priority",
    description:
      "Look across all open tasks and unresolved issues on an event and identify what needs attention first. READ-ONLY — does not modify anything. Ranks by urgency (priority/severity) and how long something has been sitting open. Returns a ranked list plus context for the top item — use this to recommend what the user should tackle first.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
        eventName: { type: "string" },
      },
      required: [],
    },
    execute: async (input) => {
      const eventId = await resolveEventId(input);
      const [tasks, issues] = await Promise.all([
        getTasks(eventId),
        getIssues(eventId),
      ]);

      const now = Date.now();
      const ageInHours = (iso: string) =>
        (now - new Date(iso).getTime()) / (1000 * 60 * 60);

      const TASK_PRIORITY_WEIGHT: Record<string, number> = {
        urgent: 100,
        normal: 50,
        optional: 10,
      };
      const ISSUE_SEVERITY_WEIGHT: Record<string, number> = {
        high: 100,
        medium: 50,
        low: 10,
      };

      const openTasks = tasks
        .filter((t) => t.status !== "done")
        .map((t) => ({
          kind: "task" as const,
          id: t.id,
          label: t.title,
          notes: t.notes ?? "",
          priority: t.priority,
          ageHours: Math.round(ageInHours(t.createdAt)),
          // urgency score: base weight from priority, plus a small nudge for how long it's been open
          score:
            TASK_PRIORITY_WEIGHT[t.priority] +
            Math.min(ageInHours(t.createdAt) / 2, 20),
        }));

      const openIssues = issues
        .filter((i) => !i.resolved)
        .map((i) => ({
          kind: "issue" as const,
          id: i.id,
          label: i.description,
          notes: "",
          severity: i.severity,
          ageHours: Math.round(ageInHours(i.createdAt)),
          // issues get a flat bump over tasks of equivalent weight — a live problem usually
          // blocks other work, so it's weighted to surface slightly above an equivalent task
          score:
            ISSUE_SEVERITY_WEIGHT[i.severity] +
            Math.min(ageInHours(i.createdAt) / 2, 20) +
            5,
        }));

      const ranked = [...openTasks, ...openIssues].sort(
        (a, b) => b.score - a.score,
      );

      if (ranked.length === 0) {
        return {
          message:
            "Nothing open — no unfinished tasks or unresolved issues on this event.",
          ranked: [],
        };
      }

      const top = ranked[0];

      return {
        recommendation: top,
        ranked: ranked.slice(0, 8).map((r) => ({
          kind: r.kind,
          label: r.label,
          urgency: r.kind === "task" ? r.priority : r.severity,
          openForHours: r.ageHours,
        })),
        instruction:
          "The 'recommendation' field is the single highest-priority item to suggest tackling first. Present it clearly, then optionally mention the next couple of items from 'ranked' as runners-up. Do not modify anything — this is informational only.",
      };
    },
  });
}
