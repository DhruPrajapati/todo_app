import { useSearchParams } from "react-router-dom";
import { useTodos } from "../store/todos_store";

const Todos = () => {
  const { todos, toggleTodoAsCompleted, handleDeleteTodo } = useTodos();
  const [searchParams] = useSearchParams();
  let todosData = searchParams.get("todos");
  let filterData = todos;

  if (todosData === "active") {
    filterData = todos.filter((todo) => !todo.completed);
  } else if (todosData === "completed") {
    filterData = todos.filter((todo) => todo.completed);
  }

  return (
    <ul className="main-task">
      {filterData.map((todo) => {
        return (
          <li key={todo.id}>
            <input
              type="checkbox"
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onChange={() => toggleTodoAsCompleted(todo.id)}
            />
            <label htmlFor="">{todo.task}</label>
            {todo.completed && (
              <button type="button" onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Todos;
