import { memo } from "react";
import { Todo, todoState } from "../core/domain/todo";

type ViewingTodoProps = Pick<Todo, "title" | "state" | "id"> & {
  onToggle(id: Todo["id"]): void;
};

export const ViewingTodo = memo((props: ViewingTodoProps): JSX.Element => {
  return (
    <label>
      <input
        type="checkbox"
        checked={props.state === todoState.done}
        onChange={() => props.onToggle(props.id)}
      />
      {props.title}
    </label>
  );
});
ViewingTodo.displayName = "ViewingTodo";

type EditingTodoProps = Pick<Todo, "title" | "state" | "id"> & {
  onDelete(id: Todo["id"]): void;
  onTitleChange(id: Todo["id"], title: Todo["title"]): void;
};

export const EditingTodo = memo((props: EditingTodoProps): JSX.Element => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={props.state === todoState.done}
          disabled
        />
        <input
          type="text"
          defaultValue={props.title}
          onBlur={(e) => props.onTitleChange(props.id, e.currentTarget.value)}
        />
      </label>
      <button onClick={() => props.onDelete(props.id)}>Delete</button>
    </div>
  );
});
EditingTodo.displayName = "EditingTodo";
