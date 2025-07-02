import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoardContext } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Board } from '../types/Index'; // Adjust the import path as necessary
import { Plus, Search, Calendar, Users, Sparkles } from 'lucide-react';

const BoardView: React.FC = () => {
  const { state, dispatch } = useBoardContext();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });

  const filteredBoards = state.boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoard.name.trim()) return;

    const board: Board = {
      id: Date.now().toString(),
      name: newBoard.name,
      description: newBoard.description,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      columns: [
        {
          id: '1',
          title: 'To Do',
          boardId: Date.now().toString(),
          order: 0,
          tasks: []
        },
        {
          id: '2',
          title: 'In Progress',
          boardId: Date.now().toString(),
          order: 1,
          tasks: []
        },
        {
          id: '3',
          title: 'Done',
          boardId: Date.now().toString(),
          order: 2,
          tasks: []
        }
      ]
    };

    dispatch({ type: 'ADD_BOARD', payload: board });
    setNewBoard({ name: '', description: '' });
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Task Boards
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize your projects with beautiful, intuitive task boards. Boost productivity and collaborate seamlessly.
          </p>
        </div>

        {/* Search and Create Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-purple-500 transition-colors"
            />
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Board
          </Button>
        </div>

        {/* Create Board Form */}
        {isCreating && (
          <Card className="mb-8 border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800">Create New Board</CardTitle>
              <CardDescription>Start organizing your tasks with a new board</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBoard} className="space-y-4">
                <Input
                  placeholder="Board name"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                  className="h-12 text-lg border-2 focus:border-purple-500"
                  required
                />
                <Input
                  placeholder="Board description (optional)"
                  value={newBoard.description}
                  onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                  className="h-12 text-lg border-2 focus:border-purple-500"
                />
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Board
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-2 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <Link key={board.id} to={`/board/${board.id}`} className="group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 bg-white border-2 hover:border-purple-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                      {board.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                      {board.columns.reduce((total, col) => total + col.tasks.length, 0)} tasks
                    </Badge>
                  </div>
                  {board.description && (
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {board.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {board.createdBy}
                    </div>
                    <div className="flex gap-1 mt-4">
                      {board.columns.map((column, index) => (
                        <div
                          key={column.id}
                          className={`h-2 flex-1 rounded-full ${
                            index === 0 ? 'bg-red-300' :
                            index === 1 ? 'bg-yellow-300' : 'bg-green-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredBoards.length === 0 && !isCreating && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No boards found' : 'No boards yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first board to get started!'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Board
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardView;
