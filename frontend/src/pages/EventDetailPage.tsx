import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvents, getTasks, getIssues } from "../api-handlers/event";
import { createTask, editTask as apiEditTask, completeTask, deleteTask as apiDeleteTask } from "../api-handlers/task";
import { createIssue, editIssue as apiEditIssue, resolveIssue, deleteIssue as apiDeleteIssue } from "../api-handlers/issue";
import type { EventBoard, Task, Issue, Priority, IssueSeverity, HistoryEntry } from "../types";
import { DayBoardTab } from "../components/DayBoardTab";
import { ActivityTab } from "../components/ActivityTab";
import { Avatar } from "../components/Avatar";
import { ShareLinkModal } from "../components/ShareLinkModal";
import { getHistory } from "../api-handlers/history";
import { getIdentity } from "../identity";

type Tab = "board" | "activity";

const TABS: { key: Tab; label: string }[] = [
  { key: "board", label: "Task Board" },
  { key: "activity", label: "Summary" },
];

export function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventBoard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [shareOpen, setShareOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const member = getIdentity();

  async function refreshHistory() {
    if (!eventId) return;
    try {
      setHistory(await getHistory(eventId));
    } catch (err) {
      console.error(err);
      // non-fatal — history is a nice-to-have, don't block the rest of the page on it
    }
  }

  async function loadEvent() {
    if (!eventId) return;
    setLoading(true);
    setLoadError(null);
    try {
      // No single-event GET endpoint yet — fetch the list and find this one.
      const events = await getEvents(member.id);
      const found = events.find((e) => e.id === eventId) ?? null;
      setEvent(found);
      if (found) {
        const [taskData, issueData, historyData] = await Promise.all([getTasks(eventId), getIssues(eventId), getHistory(eventId)]);
        setTasks(taskData);
        setIssues(issueData);
        setHistory(historyData);
      }
    } catch (err) {
      console.error(err);
      setLoadError("Could not load this event. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, refreshKey]);

  async function toggleTaskDone(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !event) return;
    const nextStatus = task.status === "done" ? "todo" : "done";
    try {
      await completeTask({ eventId: event.id, taskId, status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to update task. Please try again.");
    }
  }

  async function addTask(input: { title: string; notes?: string; priority: Priority; assignedTo: string | null; startDay?: string, endDay?: string }) {
    if (!event) return;
    try {
      const created = await createTask({
        eventId: event.id,
        title: input.title,
        notes: input.notes,
        priority: input.priority,
        assignedTo: input.assignedTo ?? undefined,
        startDay: input.startDay,
        endDay: input.endDay,
      });
      setTasks((prev) => [...prev, created]);
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to create task. Please try again.");
    }
  }

  async function editTask(taskId: string, updates: { title: string; notes?: string; priority: Priority; assignedTo: string | null, startDay?: string, endDay?: string, followUp?:string[]}) {
    if (!event) return;
    try {
      await apiEditTask({
        eventId: event.id,
        taskId,
        title: updates.title,
        notes: updates.notes,
        priority: updates.priority,
        assignedTo: updates.assignedTo ?? undefined,
        startDay: updates.startDay,
        endDay: updates.endDay,
        followUp: updates.followUp,
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to save task. Please try again.");
    }
  }

  async function deleteTask(taskId: string) {
    if (!event) return;
    try {
      await apiDeleteTask({ eventId: event.id, taskId });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task. Please try again.");
    }
  }

  async function toggleIssueResolved(issueId: string) {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue || !event) return;
    const nextResolved = !issue.resolved;
    try {
      await resolveIssue({
        eventId: event.id,
        issueId,
        resolved: nextResolved,
        resolvedBy: nextResolved ? member.id : undefined,
      });
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, resolved: nextResolved, resolvedBy: nextResolved ? member.id : undefined } : i))
      );
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to update issue. Please try again.");
    }
  }

  async function addIssue(description: string, severity: IssueSeverity) {
    if (!event) return;
    try {
      const created = await createIssue({ eventId: event.id, description, severity, raisedBy: member.id });
      setIssues((prev) => [...prev, created]);
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to flag issue. Please try again.");
    }
  }

  async function editIssue(issueId: string, updates: { description: string; severity: IssueSeverity }) {
    if (!event) return;
    try {
      await apiEditIssue({ eventId: event.id, issueId, description: updates.description, severity: updates.severity });
      setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ...updates } : i)));
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to save issue. Please try again.");
    }
  }

  async function deleteIssue(issueId: string) {
    if (!event) return;
    try {
      await apiDeleteIssue({ eventId: event.id, issueId });
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      setRefreshKey((prev) => prev + 1);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue. Please try again.");
    }
  }

  if (loading) return <div className="p-16 text-center text-ink-soft">Loading event…</div>;

  if (loadError) {
    return (
      <div className="p-16 text-center">
        <p className="text-urgent text-sm mb-3">{loadError}</p>
        <button onClick={loadEvent} className="text-loop text-sm font-medium">Try again</button>
      </div>
    );
  }

  if (!event) return <div className="p-16 text-center text-ink-soft">Event not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
      <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
        <div>
          {event.type && (
            <span className="text-[11px] uppercase tracking-wide text-loop bg-loop-soft px-2 py-0.5 rounded-full">
              {event.type}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl mt-2">{event.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex">
            {event.members.map((m, i) => (
              <div key={m.id} className={i > 0 ? "-ml-1.5" : ""}>
                <Avatar member={m} size={28} />
              </div>
            ))}
          </div>
          <button
            onClick={() => setShareOpen(true)}
            className="border border-line-strong bg-white rounded-lg px-4 py-2 text-sm font-semibold hover:border-loop hover:text-loop transition-colors"
          >
            Share link
          </button>
        </div>
      </div>

      <div className="flex border-b border-line mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === tab.key ? "text-ink border-loop font-semibold" : "text-ink-soft border-transparent hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "board" && (
          <DayBoardTab
            event={event}
            tasks={tasks}
            currentUserId={member.id}
            onToggleTaskDone={toggleTaskDone}
            onAddTask={addTask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
          />
        )}
        {activeTab === "activity" && (
          <ActivityTab
            issues={issues}
            tasks={tasks}
            members={event.members}
            history={history}
            onToggleResolved={toggleIssueResolved}
            onAddIssue={addIssue}
            onEditIssue={editIssue}
            onDeleteIssue={deleteIssue}
          />
        )}
      </div>

      {shareOpen && <ShareLinkModal inviteCode={event.inviteCode} onClose={() => setShareOpen(false)} />}
    </div>
  );
}