import { z } from "zod";

export type TodoState = keyof typeof todoState;
export const todoState = {
  open: "open",
  done: "done",
} as const;

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(128),
  state: z.nativeEnum(todoState),
  created: z.string().datetime(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Todo extends z.infer<typeof todoSchema> {}

export function createTodo(title: Todo["title"]): Todo {
  const parsed = todoSchema.shape.title.parse(title);
  return {
    id: crypto.randomUUID(),
    title: parsed,
    state: todoState.open,
    created: new Date().toISOString(),
  };
}

export function editTodo(todo: Todo, title: Todo["title"]): Todo {
  const parsed = todoSchema.shape.title.parse(title);
  return {
    ...todo,
    title: parsed,
  };
}

export function completeTodo(todo: Todo): Todo {
  if (todo.state === todoState.done) return todo;
  return { ...todo, state: todoState.done };
}

export function reopenTodo(todo: Todo): Todo {
  if (todo.state === todoState.open) return todo;
  return { ...todo, state: todoState.open };
}

export function isTitleValid(title: string): boolean {
  const result = todoSchema.shape.title.safeParse(title);
  return result.success;
}

export function isTodoCompleted(todo: Todo): boolean {
  return todo.state === todoState.done;
}
