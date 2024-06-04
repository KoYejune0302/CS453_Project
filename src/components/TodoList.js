import React, { useEffect } from "react";
import Header from "./Header";
import AddTodo from "./AddTodo";
import TodoLists from "./TodoLists";

export default function TodoList() {
  const [todos, setTodos] = React.useState([]);

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      const parsedJSON = JSON.parse(todos);
      setTodos(parsedJSON);
    }
  }, []);

  useEffect(() => {
    const json = JSON.stringify(todos);
    localStorage.setItem("todos", json);
  }, [todos]);

  const handleAddTodo = (event) => {
    event.preventDefault();
    const todo = event.target.todo?.value?.trim() || "";
    if (todo) {
      setTodos([...todos, todo]);
      event.target.todo.value = "";
    }
  };

  return (
    <div className="container">
      <Header />
      <AddTodo handleAddTodo={handleAddTodo} />
      <TodoLists todos={todos} />
    </div>
  );
}
