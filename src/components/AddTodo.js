import React from "react";
import { Form, Button } from "react-bootstrap";

function AddTodo(props) {
  return (
    <Form onSubmit={props.handleAddTodo}>
      <Form.Group controlId="item">
        <Form.Label>What you want to do?</Form.Label>
        <input
          type="text"
          name="todo"
          placeholder="Enter todo"
          data-testid="todo-input"
          onChange={alert(1)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" data-testid="todo-submit" onClick={alert(2)}>
        Add Todo
      </Button>
    </Form>
  );
};

export default AddTodo;
