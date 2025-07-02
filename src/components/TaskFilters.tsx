import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Priority } from '../types/Index'; // Adjust the import path as necessary

interface TaskFiltersProps {
  priorityFilter: Priority | 'all';
  setPriorityFilter: (filter: Priority | 'all') => void;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week';
  setDueDateFilter: (filter: 'all' | 'overdue' | 'today' | 'week') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  dueDateFilter,
  setDueDateFilter
}) => {
  const priorityOptions: Array<{ value: Priority | 'all'; label: string; color?: string }> = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' }
  ];

  const dueDateOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Priority</h4>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant={priorityFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setPriorityFilter(option.value)}
              className={`text-xs ${
                priorityFilter === option.value 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {option.value !== 'all' && (
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  option.value === 'high' ? 'bg-red-500' :
                  option.value === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
              )}
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Due Date</h4>
        <div className="flex flex-wrap gap-2">
          {dueDateOptions.map((option) => (
            <Button
              key={option.value}
              variant={dueDateFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setDueDateFilter(option.value as any)}
              className={`text-xs ${
                dueDateFilter === option.value 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
