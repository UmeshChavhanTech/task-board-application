import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Board, Task, Column } from '../types/Index';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
}

type BoardAction =
  | { type: 'SET_BOARDS'; payload: Board[] }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'SET_CURRENT_BOARD'; payload: Board | null }
  | { type: 'ADD_COLUMN'; payload: { boardId: string; column: Column } }
  | { type: 'DELETE_COLUMN'; payload: { boardId: string; columnId: string } }
  | { type: 'UPDATE_COLUMN'; payload: { boardId: string; column: Column } }
  | { type: 'ADD_TASK'; payload: { boardId: string; columnId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: { boardId: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { boardId: string; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { boardId: string; taskId: string; newColumnId: string; newOrder: number } };

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    
    case 'ADD_BOARD':
      const newBoards = [...state.boards, action.payload];
      localStorage.setItem('taskboard-data', JSON.stringify(newBoards));
      return { ...state, boards: newBoards };
    
    case 'DELETE_BOARD':
      const filteredBoards = state.boards.filter(board => board.id !== action.payload);
      localStorage.setItem('taskboard-data', JSON.stringify(filteredBoards));
      return { 
        ...state, 
        boards: filteredBoards,
        currentBoard: state.currentBoard?.id === action.payload ? null : state.currentBoard
      };
    
    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoard: action.payload };
    
    case 'ADD_COLUMN':
      const updatedBoardsAddColumn = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { ...board, columns: [...board.columns, action.payload.column] }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsAddColumn));
      return { 
        ...state, 
        boards: updatedBoardsAddColumn,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { ...state.currentBoard, columns: [...state.currentBoard.columns, action.payload.column] }
          : state.currentBoard
      };
    
    case 'DELETE_COLUMN':
      const updatedBoardsDeleteColumn = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { ...board, columns: board.columns.filter(col => col.id !== action.payload.columnId) }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsDeleteColumn));
      return { 
        ...state, 
        boards: updatedBoardsDeleteColumn,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { ...state.currentBoard, columns: state.currentBoard.columns.filter(col => col.id !== action.payload.columnId) }
          : state.currentBoard
      };
    
    case 'UPDATE_COLUMN':
      const updatedBoardsUpdateColumn = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { ...board, columns: board.columns.map(col => col.id === action.payload.column.id ? action.payload.column : col) }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsUpdateColumn));
      return { 
        ...state, 
        boards: updatedBoardsUpdateColumn,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { ...state.currentBoard, columns: state.currentBoard.columns.map(col => col.id === action.payload.column.id ? action.payload.column : col) }
          : state.currentBoard
      };
    
    case 'ADD_TASK':
      const updatedBoardsAddTask = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { 
              ...board, 
              columns: board.columns.map(col => 
                col.id === action.payload.columnId 
                  ? { ...col, tasks: [...col.tasks, action.payload.task] }
                  : col
              )
            }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsAddTask));
      return { 
        ...state, 
        boards: updatedBoardsAddTask,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { 
              ...state.currentBoard, 
              columns: state.currentBoard.columns.map(col => 
                col.id === action.payload.columnId 
                  ? { ...col, tasks: [...col.tasks, action.payload.task] }
                  : col
              )
            }
          : state.currentBoard
      };
    
    case 'UPDATE_TASK':
      const updatedBoardsUpdateTask = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { 
              ...board, 
              columns: board.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(task => task.id === action.payload.task.id ? action.payload.task : task)
              }))
            }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsUpdateTask));
      return { 
        ...state, 
        boards: updatedBoardsUpdateTask,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { 
              ...state.currentBoard, 
              columns: state.currentBoard.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(task => task.id === action.payload.task.id ? action.payload.task : task)
              }))
            }
          : state.currentBoard
      };
    
    case 'DELETE_TASK':
      const updatedBoardsDeleteTask = state.boards.map(board => 
        board.id === action.payload.boardId 
          ? { 
              ...board, 
              columns: board.columns.map(col => ({
                ...col,
                tasks: col.tasks.filter(task => task.id !== action.payload.taskId)
              }))
            }
          : board
      );
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsDeleteTask));
      return { 
        ...state, 
        boards: updatedBoardsDeleteTask,
        currentBoard: state.currentBoard?.id === action.payload.boardId 
          ? { 
              ...state.currentBoard, 
              columns: state.currentBoard.columns.map(col => ({
                ...col,
                tasks: col.tasks.filter(task => task.id !== action.payload.taskId)
              }))
            }
          : state.currentBoard
      };
    
    case 'MOVE_TASK':
      const { boardId, taskId, newColumnId, newOrder } = action.payload;
      const updatedBoardsMoveTask = state.boards.map(board => {
        if (board.id !== boardId) return board;
        
        let taskToMove: Task | null = null;
        const columnsWithoutTask = board.columns.map(col => ({
          ...col,
          tasks: col.tasks.filter(task => {
            if (task.id === taskId) {
              taskToMove = task;
              return false;
            }
            return true;
          })
        }));
        
        if (!taskToMove) return board;
        
        const updatedTask = { ...taskToMove, columnId: newColumnId, order: newOrder };
        const finalColumns = columnsWithoutTask.map(col => 
          col.id === newColumnId 
            ? { ...col, tasks: [...col.tasks, updatedTask].sort((a, b) => a.order - b.order) }
            : col
        );
        
        return { ...board, columns: finalColumns };
      });
      
      localStorage.setItem('taskboard-data', JSON.stringify(updatedBoardsMoveTask));
      return { 
        ...state, 
        boards: updatedBoardsMoveTask,
        currentBoard: state.currentBoard?.id === boardId 
          ? updatedBoardsMoveTask.find(b => b.id === boardId) || null
          : state.currentBoard
      };
    
    default:
      return state;
  }
}

const BoardContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
} | null>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('taskboard-data');
    if (savedData) {
      try {
        const boards = JSON.parse(savedData);
        dispatch({ type: 'SET_BOARDS', payload: boards });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
