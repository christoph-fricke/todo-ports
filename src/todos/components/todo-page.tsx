import { FormEventHandler, useId } from "react";
import { useSelector } from "@xstate/react";
import type {
  EventBusWithTodoEvents,
  TodoManagerActor,
} from "../orchestration/todo-manager";
import { createNewTodo } from "../orchestration/todo-manager.model";
import { useTodoManagerEvents } from "../orchestration/use-todo-manager";
import { EditingTodo, ViewingTodo } from "./todo";
import { ConfirmDeletionDialog } from "./confirm-dialog";

type TodoPageProps = {
  todoManager: TodoManagerActor;
  bus: EventBusWithTodoEvents;
};

export function TodoPage(props: TodoPageProps): JSX.Element {
  const events = useTodoManagerEvents(props.bus);

  const todos = useSelector(props.todoManager, (state) => state.context.todos);
  const newTitle = useSelector(
    props.todoManager,
    (state) => state.context.newTodoTitle
  );
  const isEditMode = useSelector(props.todoManager, (state) =>
    state.hasTag("editing")
  );
  const canAddTodo = useSelector(props.todoManager, (state) =>
    state.can(createNewTodo)
  );
  const showDeleteDialog = useSelector(props.todoManager, (state) =>
    state.hasTag("deletion-dialog")
  );

  return (
    <main>
      <ConfirmDeletionDialog
        open={showDeleteDialog}
        onCancel={events.cancelDelete}
        onConfirm={events.confirmDelete}
      />
      <div
        style={{
          display: "flex",
          gap: "64px",
          alignItems: "center",
        }}
      >
        <h1>Todos</h1>
        <button onClick={events.toggleEditing}>
          {isEditMode ? "Finish" : "Edit"}
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {isEditMode ? (
              <EditingTodo
                id={todo.id}
                title={todo.title}
                state={todo.state}
                onDelete={events.deleteTodo}
                onTitleChange={events.updateTodo}
              />
            ) : (
              <ViewingTodo
                id={todo.id}
                title={todo.title}
                state={todo.state}
                onToggle={events.toggleTodo}
              />
            )}
          </li>
        ))}
      </ul>
      {isEditMode && (
        <NewTodoForm
          newTodoTitle={newTitle}
          canSubmit={canAddTodo}
          onTitleChange={events.changeNewTodoTitle}
          onSubmit={events.createNewTodo}
        />
      )}
    </main>
  );
}

type NewTodoFormProps = {
  newTodoTitle: string;
  canSubmit: boolean;
  onTitleChange(title: string): void;
  onSubmit(): void;
};

export function NewTodoForm(props: NewTodoFormProps): JSX.Element {
  const titleId = useId();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={titleId}>New Todo</label>
      <input
        id={titleId}
        type="text"
        value={props.newTodoTitle}
        onChange={(e) => props.onTitleChange(e.currentTarget.value)}
      />

      <button type="submit" disabled={!props.canSubmit}>
        Submit
      </button>
    </form>
  );
}
