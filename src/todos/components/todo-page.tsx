import { FormEventHandler, useId } from "react";
import type {
  EventBusWithTodoEvents,
  TodoManagerActor,
} from "../orchestration/todo-manager";
import { useTodoManagerEvents, useTodoManagerState } from "../orchestration/use-todo-manager";
import { EditingTodo, ViewingTodo } from "./todo";
import { ConfirmDeletionDialog } from "./confirm-dialog";

type TodoPageProps = {
  todoManager: TodoManagerActor;
  bus: EventBusWithTodoEvents;
};

export function TodoPage(props: TodoPageProps): JSX.Element {
  const state = useTodoManagerState(props.todoManager);
  const events = useTodoManagerEvents(props.bus);

  return (
    <main>
      <ConfirmDeletionDialog
        open={state.showDeleteDialog}
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
          {state.isEditMode ? "Finish" : "Edit"}
        </button>
      </div>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id}>
            {state.isEditMode ? (
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
      {state.isEditMode && (
        <NewTodoForm
          newTodoTitle={state.newTitle}
          canSubmit={state.canAddTodo}
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
