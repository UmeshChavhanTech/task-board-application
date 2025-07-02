import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './TaskCard';
import { CreateTaskForm } from './CreateTaskForm';
import { EditColumnModal } from './EditColumnModal';
import { Column } from '../types/Index';
import { Plus, MoreVertical, Grip } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoardContext } from '@/context/BoardContext';

interface TaskColumnProps {
  column: Column;
  boardId: string;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ column, boardId }) => {
  const { dispatch } = useBoardContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  const handleDeleteColumn = () => {
    dispatch({
      type: 'DELETE_COLUMN',
      payload: { boardId, columnId: column.id }
    });
  };

  const getColumnGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
      'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
      'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
      'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
      'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
    ];
    return gradients[index % gradients.length];
  };

  const getHeaderGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-red-500 to-pink-500',
      'bg-gradient-to-r from-yellow-500 to-orange-500',
      'bg-gradient-to-r from-green-500 to-emerald-500',
      'bg-gradient-to-r from-blue-500 to-indigo-500',
      'bg-gradient-to-r from-purple-500 to-violet-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <>
      <Card className={`h-fit min-h-[500px] w-80 ${getColumnGradient(column.order)} border-2 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <CardHeader className={`${getHeaderGradient(column.order)} text-white rounded-t-lg -m-6 mb-4 mx-0`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <Grip className="h-4 w-4 opacity-60" />
              <CardTitle className="text-lg font-bold">{column.title}</CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {column.tasks.length}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                <DropdownMenuItem onClick={() => setIsEditingColumn(true)}>
                  Edit Column
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteColumn} className="text-red-600">
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} boardId={boardId} />
          ))}
          
          {column.tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm">No tasks yet</p>
            </div>
          )}
          
          <Button
            onClick={() => setIsAddingTask(true)}
            variant="outline"
            className="w-full border-dashed border-2 hover:bg-white/80 hover:border-solid transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      {isAddingTask && (
        <CreateTaskForm
          columnId={column.id}
          boardId={boardId}
          onClose={() => setIsAddingTask(false)}
        />
      )}

      {isEditingColumn && (
        <EditColumnModal
          column={column}
          boardId={boardId}
          onClose={() => setIsEditingColumn(false)}
        />
      )}
    </>
  );
};
