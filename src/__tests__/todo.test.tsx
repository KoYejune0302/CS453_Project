import { fireEvent, render, screen } from "@testing-library/react";
import TodoList from "../components/TodoList";
import React from "react";
import MyComponent from "../components/MyComponent";

test("render TodoList", async () => {
  render(<TodoList />);
});

test("render TodoList with todos", async () => {
  render(<TodoList />);
  fireEvent.change(screen.getByTestId("todo-input"), {
    target: { value: "hello" },
  });
  fireEvent.click(screen.getByTestId("todo-submit"));
});

test("render MyComponent", async () => {
  render(<MyComponent />);
});
