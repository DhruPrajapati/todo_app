import { createContext, useContext, useState, type ReactNode } from "react";

export type TodosProviderProps = {
  children: ReactNode;
};

export type Todo = {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
};

export type TodosContextType = {
  todos: Todo[];
  handleAddTodo: (task: string) => void;
  toggleTodoAsCompleted: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
};

export const todosContext = createContext<TodosContextType | null>(null);

export const TodosProvider = ({ children }: TodosProviderProps) => {

  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
        const storedTodos = localStorage.getItem("todos") || "[]";
        return JSON.parse(storedTodos) as Todo[];
    } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
        return [];  
    }
  });

  const handleAddTodo = (task: string) => {
    setTodos((prevTodos) => {
      const newTodos: Todo[] = [
        {
          id: Math.random().toString(),
          task,
          completed: false,
          createdAt: new Date(),
        },
        ...prevTodos,
      ];

      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
  };

  //toggle todo as completed
  const toggleTodoAsCompleted = (id: string) => {
    setTodos((prevTodos) => {
      let newtodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(newtodos));
      return newtodos;
    });
  };

  // Delete todo
  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => {
      let newTodos = prevTodos.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
  };

  return (
    <todosContext.Provider
      value={{ todos, handleAddTodo, toggleTodoAsCompleted, handleDeleteTodo }}>
      {children}
    </todosContext.Provider>
  );
};

export const useTodos = () => {
  const todosConsumer = useContext(todosContext);
  if (!todosConsumer) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return todosConsumer;
};
