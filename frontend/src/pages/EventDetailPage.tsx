import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { mockEvents, mockTasks, mockIssues, mockHistory, currentUserId } from "../data/mockData";
import type { Task, Issue, Priority, IssueSeverity } from "../types";
import { DayBoardTab } from "../components/DayBoardTab";
import { ActivityTab } from "../components/ActivityTab";
import { Avatar } from "../components/Avatar";
import { ShareLinkModal } from "../components/ShareLinkModal";

type Tab = "board" | "activity";

const TABS: { key: Tab; label: string }[] = [
  { key: "board", label: "Task Board" },
  { key: "activity", label: "Summary" },
];

export function EventDetailPage() {
  const { eventId } = useParams();
  const event = mockEvents.find((e) => e.id === eventId);

  const [tasks, setTasks] = useState<Task[]>(mockTasks.filter((t) => t.eventId === eventId));
  const [issues, setIssues] = useState<Issue[]>(mockIssues.filter((i) => i.eventId === eventId));
  const history = useMemo(() => mockHistory.filter((h) => h.eventId === eventId), [eventId]);

  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [shareOpen, setShareOpen] = useState(false);

  if (!event) {
    return <div className="p-16 text-center text-ink-soft">Event not found.</div>;
  }

  function toggleTaskDone(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === "done" ? "todo" : "done" } : t))
    );
  }

  function addTask(input: { title: string; notes?: string; priority: Priority; assignedTo: string | null; day: number }) {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      eventId: event!.id,
      title: input.title,
      notes: input.notes,
      priority: input.priority,
      status: "todo",
      assignedTo: input.assignedTo,
      dueDay: input.day,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function toggleIssueResolved(issueId: string) {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, resolved: !i.resolved } : i)));
  }

  function addIssue(description: string, severity: IssueSeverity) {
    const newIssue: Issue = {
      id: `i-${Date.now()}`,
      eventId: event!.id,
      description,
      severity,
      resolved: false,
      raisedBy: currentUserId,
      createdAt: new Date().toISOString(),
    };
    setIssues((prev) => [...prev, newIssue]);
  }
  function editTask(taskId: string, updates: { title: string; notes?: string; priority: Priority; assignedTo: string | null }) {
  setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
  //editTask(??)
}

function completeTask(taskId: string) {
  setTasks((prev) => prev.filter((t) => t.id !== taskId));
}

function deleteTask(taskId: string) {
  setTasks((prev) => prev.filter((t) => t.id !== taskId));
}

function editIssue(issueId: string, updates: { description: string; severity: IssueSeverity }) {
  setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ...updates } : i)));
}

function deleteIssue(issueId: string) {
  setIssues((prev) => prev.filter((i) => i.id !== issueId));
}

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
            className={`flex-1 py-3 px-4 rounded-xl text-center whitespace-nowrap transition-all duration-200 ${activeTab === tab.key
                ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-ink font-semibold"
                : "text-ink-soft hover:bg-white/5 hover:text-ink"
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
    currentUserId={currentUserId}
    onToggleTaskDone={toggleTaskDone}
    onAddTask={addTask}
    onEditTask={editTask}
    onDeleteTask={deleteTask}
    onCompleteTask={completeTask}
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