import React from 'react';
import { useTeamMembers } from '../../store/selectors';
import { useAppStore } from '../../store/useAppStore';
import { AddTeamMemberForm } from './AddTeamMemberForm';

export const TeamMemberList: React.FC = () => {
  const teamMembers = useTeamMembers();
  const removeTeamMember = useAppStore((state) => state.removeTeamMember);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        Team Members
      </h2>
      <AddTeamMemberForm />
      <ul className="space-y-2">
        {teamMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-md p-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: member.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">{member.name}</span>
            </div>
            <button
              onClick={() => removeTeamMember(member.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Remove member"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
        {teamMembers.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            No team members yet
          </li>
        )}
      </ul>
    </div>
  );
};
