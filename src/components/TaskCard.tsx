import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditTaskModal } from './EditTaskModal';
import { Task } from '../types/Index'; // Adjust the import path as necessary
import { Calendar, User, MoreVertical, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoardContext } from '@/context/BoardContext';

interface TaskCardProps {
  task: Task;
  boardId: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, boardId }) => {
  const { dispatch } = useBoardContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { boardId, taskId: task.id }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date();
  const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white border-l-4 border-l-blue-500 hover:border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2">
              {task.title}
            </h4>
            <div className="flex items-center gap-2">
              {task.priority === 'high' && (
                <Star className="h-4 w-4 text-red-500 fill-current" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Badge 
            className={`${getPriorityColor(task.priority)} shadow-lg w-fit`}
          >
            {task.priority.toUpperCase()}
          </Badge>
        </CardHeader>
        
        <CardContent className="pt-0">
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {task.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-500'}`}>
              <Calendar className="h-3 w-3 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && <span className="ml-1 text-red-600 font-semibold">(Overdue)</span>}
              {!isOverdue && isDueSoon && <span className="ml-1 text-orange-600 font-semibold">(Due Soon)</span>}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <User className="h-3 w-3 mr-1" />
              {task.createdBy}
            </div>
          </div>
          
          {/* Progress indicator based on priority */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: task.priority === 'high' ? '90%' : task.priority === 'medium' ? '60%' : '30%' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <EditTaskModal
          task={task}
          boardId={boardId}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};
