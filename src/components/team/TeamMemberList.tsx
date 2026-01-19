import React from 'react';
import { useTeamMembers } from '../../store/selectors';
import { useAppStore } from '../../store/useAppStore';
import { AddTeamMemberForm } from './AddTeamMemberForm';

export const TeamMemberList: React.FC = () => {
  const teamMembers = useTeamMembers();
  const removeTeamMember = useAppStore((state) => state.removeTeamMember);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
      <AddTeamMemberForm />
      <ul className="space-y-2">
        {teamMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: member.color }}
              />
              <span className="text-sm text-gray-700">{member.name}</span>
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
          <li className="text-sm text-gray-500 text-center py-2">
            No team members yet
          </li>
        )}
      </ul>
    </div>
  );
};
