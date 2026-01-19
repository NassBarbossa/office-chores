import React from 'react';
import type { CalendarEvent } from '../../types';
import { useTeamMemberById } from '../../store/selectors';

interface ChoreEventProps {
  event: CalendarEvent;
}

export const ChoreEvent: React.FC<ChoreEventProps> = ({ event }) => {
  const { resource: instance } = event;
  const assignee = useTeamMemberById(instance.assigneeId);
  const isCompleted = instance.status === 'completed';

  const backgroundColor = assignee?.color || '#9CA3AF';
  const opacity = isCompleted ? 0.6 : 1;

  return (
    <div
      className="px-1 py-0.5 rounded text-xs truncate"
      style={{ backgroundColor, opacity }}
    >
      <span className={`text-white font-medium ${isCompleted ? 'line-through' : ''}`}>
        {instance.title}
      </span>
      {assignee && (
        <span className="text-white/80 ml-1">({assignee.name})</span>
      )}
    </div>
  );
};
