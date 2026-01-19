import React from 'react';
import { TeamMemberList } from '../team/TeamMemberList';
import { ChoreTemplateList } from '../chores/ChoreTemplateList';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-6">
        <TeamMemberList />
        <ChoreTemplateList />
      </div>
    </aside>
  );
};
