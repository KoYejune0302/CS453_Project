/* eslint-disable testing-library/prefer-screen-queries */
import { fireEvent, render } from "@testing-library/react";
import TodoList from "../components/TodoList";
import React from "react";
import MyComponent from "../components/MyComponent";

test("render TodoList", async () => {
  render(<TodoList />);
});

test("render TodoList with todos", async () => {
  const { getByTestId } = render(<TodoList />);
  fireEvent.change(getByTestId("todo-input"), {
    target: { value: "hello" },
  });
  fireEvent.click(getByTestId("todo-submit"));
});

test("render MyComponent", async () => {
  render(<MyComponent />);
});
