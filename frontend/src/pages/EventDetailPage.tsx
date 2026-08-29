import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  mockEvents,
  mockTasks,
  mockIssues,
  mockTimeline,
  mockHistory,
  currentUserId,
} from "../data/mockData";
import type { Task, Issue, Priority, IssueSeverity } from "../types";
import { KanbanBoard } from "../components/KanbanBoard";
import { IssuesList } from "../components/IssuesList";
import { TimelineRoadmap } from "../components/TimelineRoadmap";
import { TimelineView } from "../components/TimelineView";
import { SummaryPanel } from "../components/SummaryPanel";
import { HistoryLog } from "../components/HistoryLog";
import { Avatar } from "../components/Avatar";
import { ShareLinkModal } from "../components/ShareLinkModal";

type Tab = "board" | "timeline" | "issues" | "summary" | "history";

const TABS: { key: Tab; label: string }[] = [
  { key: "board", label: "Board" },
  { key: "timeline", label: "Timeline" },
  { key: "issues", label: "Issues" },
  { key: "summary", label: "Summary" },
  { key: "history", label: "History" },
];

export function EventDetailPage() {
  const { eventId } = useParams();
  const event = mockEvents.find((e) => e.id === eventId);

  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.filter((t) => t.eventId === eventId),
  );
  const [issues, setIssues] = useState<Issue[]>(
    mockIssues.filter((i) => i.eventId === eventId),
  );
  const timeline = useMemo(
    () => mockTimeline.filter((t) => t.eventId === eventId),
    [eventId],
  );
  const history = useMemo(
    () => mockHistory.filter((h) => h.eventId === eventId),
    [eventId],
  );

  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [shareOpen, setShareOpen] = useState(false);

  if (!event) {
    return (
      <div className="p-16 text-center text-ink-soft">Event not found.</div>
    );
  }

  function toggleTaskDone(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t,
      ),
    );
  }

  function addTask(title: string, priority: Priority) {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      eventId: event!.id,
      title,
      priority,
      status: "todo",
      assignedTo: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function toggleIssueResolved(issueId: string) {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, resolved: !i.resolved } : i)),
    );
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

  return (
    <div className="mx-auto px-6 sm:px-10 py-10 sm:py-12">
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

      <div className="flex gap-2 border-b border-line mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-2 py-3 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "text-ink border-loop font-semibold"
                : "text-ink-soft border-transparent hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "board" && (
          <KanbanBoard
            tasks={tasks}
            members={event.members}
            onToggleTaskDone={toggleTaskDone}
            onAddTask={addTask}
          />
        )}
        {activeTab === "timeline" &&
          (event.endDate ? (
            <div>
              <TimelineRoadmap event={event} tasks={tasks} items={timeline} />
              <SummaryPanel tasks={tasks} issues={issues} />
            </div>
          ) : (
            <TimelineView items={timeline} />
          ))}
        {activeTab === "issues" && (
          <IssuesList
            issues={issues}
            members={event.members}
            onToggleResolved={toggleIssueResolved}
            onAddIssue={addIssue}
          />
        )}
        {activeTab === "summary" && (
          <SummaryPanel tasks={tasks} issues={issues} />
        )}
        {activeTab === "history" && (
          <HistoryLog entries={history} members={event.members} />
        )}
      </div>

      {shareOpen && (
        <ShareLinkModal
          inviteCode={event.inviteCode}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
