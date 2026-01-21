import React, { useState, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import type { CalendarEvent } from '../../types';
import { format } from 'date-fns';

interface SetTimeModalProps {
  event: CalendarEvent | null;
  newDate: Date | null;
  onClose: () => void;
}

export const SetTimeModal: React.FC<SetTimeModalProps> = ({ event, newDate, onClose }) => {
  const [time, setTime] = useState('09:00');
  const [noSpecificTime, setNoSpecificTime] = useState(true);
  const updateChoreDateTime = useAppStore((state) => state.updateChoreDateTime);

  const handleConfirm = useCallback(() => {
    if (!event || !newDate) return;

    const dateString = format(newDate, 'yyyy-MM-dd');
    const timeValue = noSpecificTime ? undefined : time;
    updateChoreDateTime(event.resource.id, dateString, timeValue);
    onClose();
  }, [event, newDate, noSpecificTime, time, updateChoreDateTime, onClose]);

  const handleClose = useCallback(() => {
    setTime('09:00');
    setNoSpecificTime(true);
    onClose();
  }, [onClose]);

  if (!event || !newDate) return null;

  const formattedDate = format(newDate, 'EEEE, MMMM d, yyyy');

  return (
    <Modal isOpen={!!event && !!newDate} onClose={handleClose} title="Set Chore Time">
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <strong>Chore:</strong> {event.resource.title}
        </div>

        <div className="text-sm text-gray-600">
          <strong>New Date:</strong> {formattedDate}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={noSpecificTime}
              onChange={(e) => setNoSpecificTime(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">No specific time (all-day event)</span>
          </label>

          {!noSpecificTime && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
