import React from "react";
import { Form, Button } from "react-bootstrap";

const AddTodo = (props) => {
  return (
    <Form onSubmit={props.handleAddTodo}>
      <Form.Group controlId="item">
        <Form.Label>What you want to do?</Form.Label>
        <input
          type="text"
          name="todo"
          placeholder="Enter todo"
          data-testid="todo-input"
        />
      </Form.Group>
      <Button variant="primary" type="submit" data-testid="todo-submit">
        Add Todo
      </Button>
    </Form>
  );
};

export default AddTodo;
