
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardContext } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter, Plus } from 'lucide-react';
import { TaskColumn } from '@/components/TaskColumn';
import { CreateColumnForm } from '@/components/CreateColumnForm';
import { TaskFilters } from '@/components/TaskFilters';
import { Priority } from '../types/Index'; // Adjust the import path as necessary

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { state, dispatch } = useBoardContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'week'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);

  useEffect(() => {
    if (boardId && state.boards.length > 0) {
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      }
    }
  }, [boardId, state.boards, dispatch]);

  const currentBoard = state.currentBoard;

  if (!currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Board not found</h2>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Boards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredColumns = currentBoard.columns.map(column => {
    const filteredTasks = column.tasks.filter(task => {
      // Search filter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Priority filter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      // Due date filter
      let matchesDueDate = true;
      if (dueDateFilter !== 'all') {
        const today = new Date();
        const taskDueDate = new Date(task.dueDate);
        
        switch (dueDateFilter) {
          case 'overdue':
            matchesDueDate = taskDueDate < today;
            break;
          case 'today':
            matchesDueDate = taskDueDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            matchesDueDate = taskDueDate <= weekFromNow && taskDueDate >= today;
            break;
        }
      }
      
      return matchesSearch && matchesPriority && matchesDueDate;
    });
    
    return { ...column, tasks: filteredTasks };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentBoard.name}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">{currentBoard.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-white/70 backdrop-blur-sm border-gray-200 rounded-xl"
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300 ${showFilters ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <Filter className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={() => setShowCreateColumn(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Column</span>
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <TaskFilters
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                dueDateFilter={dueDateFilter}
                setDueDateFilter={setDueDateFilter}
              />
            </div>
          )}
        </div>
      </div>

      {/* Board Content */}
      <div className="p-4 md:p-6">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {filteredColumns.map((column) => (
            <TaskColumn key={column.id} column={column} boardId={currentBoard.id} />
          ))}
          
          {/* Add Column Button */}
          <div className="min-w-80">
            <Button
              onClick={() => setShowCreateColumn(true)}
              variant="outline"
              className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all duration-300 rounded-xl"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add New Column
            </Button>
          </div>
        </div>
      </div>

      {/* Create Column Modal */}
      {showCreateColumn && (
        <CreateColumnForm
          boardId={currentBoard.id}
          onClose={() => setShowCreateColumn(false)}
        />
      )}
    </div>
  );
};

export default BoardDetail;
