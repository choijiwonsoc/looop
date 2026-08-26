import type { Priority, IssueSeverity } from '../types';
import type { ReactNode } from 'react';

const PRIORITY_LABEL: Record<Priority, string> = { urgent: 'Urgent', normal: 'Normal', optional: 'Optional' };
const SEVERITY_LABEL: Record<IssueSeverity, string> = { high: 'High', medium: 'Medium', low: 'Low' };
const SEVERITY_TO_TONE: Record<IssueSeverity, Priority> = { high: 'urgent', medium: 'normal', low: 'optional' };

const TONE_CLASSES: Record<Priority, string> = {
  urgent: 'text-urgent bg-urgent-soft',
  normal: 'text-normal bg-normal-soft',
  optional: 'text-optional bg-optional-soft',
};

export function Badge({ tone, children }: { tone: Priority; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={priority}>{PRIORITY_LABEL[priority]}</Badge>;
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return <Badge tone={SEVERITY_TO_TONE[severity]}>{SEVERITY_LABEL[severity]}</Badge>;
}