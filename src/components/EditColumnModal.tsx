import React, { useState } from 'react';
import { useBoardContext } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Column } from '../types/Index'; 

interface EditColumnModalProps {
  column: Column;
  boardId: string;
  onClose: () => void;
}

export const EditColumnModal: React.FC<EditColumnModalProps> = ({ column, boardId, onClose }) => {
  const { dispatch } = useBoardContext();
  const [title, setTitle] = useState(column.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const updatedColumn: Column = {
      ...column,
      title: title
    };

    dispatch({
      type: 'UPDATE_COLUMN',
      payload: { boardId, column: updatedColumn }
    });

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Edit Column</DialogTitle>
          <DialogDescription>
            Update the column title to better organize your workflow.
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
              placeholder="Enter column title"
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
              Update Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
