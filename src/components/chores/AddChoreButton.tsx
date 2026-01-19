import React from 'react';
import { Button } from '../ui/Button';

interface AddChoreButtonProps {
  onClick: () => void;
}

export const AddChoreButton: React.FC<AddChoreButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} size="sm" className="w-full">
      + Add Chore
    </Button>
  );
};
