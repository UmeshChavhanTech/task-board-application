import React, { useState } from 'react';
import { useBoardContext } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Column } from '../types/Index'; 

interface CreateColumnFormProps {
  boardId: string;
  onClose: () => void;
}

export const CreateColumnForm: React.FC<CreateColumnFormProps> = ({ boardId, onClose }) => {
  const { dispatch, state } = useBoardContext();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const currentBoard = state.currentBoard;
    if (!currentBoard) return;

    const newColumn: Column = {
      id: Date.now().toString(),
      title: title,
      boardId,
      order: currentBoard.columns.length,
      tasks: []
    };

    dispatch({
      type: 'ADD_COLUMN',
      payload: { boardId, column: newColumn }
    });

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Create New Column</DialogTitle>
          <DialogDescription>
            Add a new column to organize your tasks better.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Column Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title (e.g., 'In Review', 'Testing')"
              className="mt-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
