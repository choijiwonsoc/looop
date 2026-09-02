import type { Issue, Member } from "../types";
import { Avatar } from "./Avatar";
import { LoopRing } from "./LoopRing";
import { Card } from "./Card";
import { EditIcon, TrashIcon } from "./icons";
import { useState } from "react";

interface IssueCardProps {
  issue: Issue;
  color: string;
  raisedBy: Member | undefined;
  onToggleResolved: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function IssueCard({
  issue,
  color,
  raisedBy,
  onToggleResolved,
  onEdit,
  onDelete,
}: IssueCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const followUps = issue.followUp?.slice().reverse() ?? [];
  return (
    <>
      <Card className="relative group flex-row items-start gap-3">
        <LoopRing
          complete={issue.resolved}
          color={color}
          size={16}
          onClick={onToggleResolved}
        />
        <p className="flex-1 text-sm m-0 pr-14">{issue.description}</p>
        <Avatar member={raisedBy} size={20} />

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

          <button
            onClick={onEdit}
            className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-loop hover:bg-loop-soft transition-colors"
            aria-label="Edit issue"
          >
            <EditIcon size={12} />
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-urgent hover:bg-urgent-soft transition-colors"
            aria-label="Delete issue"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      </Card>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
              <div>
                <h2 className="text-base font-semibold text-ink m-0">
                  Issue details
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[11px] font-medium px-2 py-1 rounded-md ${
                      issue.resolved
                        ? "text-optional bg-optional-soft"
                        : "text-urgent bg-urgent-soft"
                    }`}
                  >
                    {issue.resolved ? "Resolved" : "Unresolved"}
                  </span>

                  <span className="text-[11px] text-ink-soft capitalize">
                    {issue.severity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-5">
              {/* Description */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Description
                </h3>

                <div className="rounded-lg bg-surface px-3 py-3">
                  <p className="text-sm text-ink whitespace-pre-wrap m-0 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </section>

              {/* Severity */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Severity
                </h3>

                <span className="text-sm text-ink capitalize">
                  {issue.severity}
                </span>
              </section>

              {/* Raised by */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Raised by
                </h3>

                <div className="flex items-center gap-2">
                  <Avatar member={raisedBy} size={28} />

                  <span className="text-sm text-ink">
                    {raisedBy?.name ?? "Unknown member"}
                  </span>
                </div>
              </section>

              {/* Resolved by */}
              {issue.resolved && (
                <section>
                  <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                    Resolved by
                  </h3>

                  {/* {resolvedBy ? (
                    <div className="flex items-center gap-2">
                      <Avatar member={resolvedBy} size={28} />

                      <span className="text-sm text-ink">
                        {resolvedBy.name}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-soft m-0">
                      No resolver recorded.
                    </p>
                  )} */}
                </section>
              )}

              {/* Follow-up */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Follow-up
                </h3>

                {followUps.length > 0 ? (
                  <div className="space-y-2">
                    {followUps.map((followUp, index) => (
                      <div
                        key={`${followUp}-${index}`}
                        className="flex gap-3 rounded-lg bg-surface px-3 py-2.5"
                      >
                        <span className="flex-shrink-0 text-[10px] font-semibold text-ink-soft mt-0.5">
                          {index === 0 ? "LATEST" : index + 1}
                        </span>

                        <p className="text-sm text-ink m-0 leading-relaxed whitespace-pre-wrap">
                          {followUp}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft m-0">
                    No follow-up updates.
                  </p>
                )}
              </section>

              {/* Timestamps */}
              <section className="pt-3 border-t border-line">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-ink-soft">Created</span>
                    <p className="text-ink m-0 mt-1">
                      {new Date(issue.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-ink-soft">Last updated</span>
                    <p className="text-ink m-0 mt-1">
                      {new Date(issue.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 py-3 border-t border-line">
              <button
                onClick={() => setShowDetails(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
