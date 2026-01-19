import React from 'react';
import { ViewToggle } from '../calendar/ViewToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Office Chores</h1>
      <ViewToggle />
    </header>
  );
};
