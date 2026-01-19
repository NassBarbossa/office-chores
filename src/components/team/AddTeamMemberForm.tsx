import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const AddTeamMemberForm: React.FC = () => {
  const [name, setName] = useState('');
  const addTeamMember = useAppStore((state) => state.addTeamMember);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addTeamMember(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="flex-1 text-sm"
      />
      <Button type="submit" size="sm" disabled={!name.trim()}>
        Add
      </Button>
    </form>
  );
};
