import React from 'react'

function TodoItem(props) {
    return (
        <div className="todo-item">
            <h2>{props.todo}</h2>
        </div>
    )
}

export default TodoItem;