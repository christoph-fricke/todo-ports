import { z } from "zod";
import { Todo, todoSchema } from "../core/domain/todo";
import type { TodoStorageOutPort } from "../core/out-ports";

const storageSchema = z.array(todoSchema);

export function createTodoStorage(
  storage: Storage,
  key: string
): TodoStorageOutPort {
  const cache = new Map<Todo["id"], Todo>();
  for (const todo of loadTodos(storage, key)) cache.set(todo.id, todo);

  const save = () => saveTodos(Array.from(cache.values()), storage, key);

  return {
    fetchAllTodos: async () => Array.from(cache.values()),

    fetchTodo: async (id) => {
      if (!cache.has(id)) throw new Error("Todo not found.");
      return cache.get(id)!;
    },

    updateTodo: async (id, todo) => {
      if (!cache.has(id)) throw new Error("Todo not found.");
      cache.set(id, todo);
      save();
      return cache.get(id)!;
    },

    saveTodo: async (todo) => {
      cache.set(todo.id, todo);
      save();
      return cache.get(todo.id)!;
    },

    deleteTodo: async (id) => {
      if (!cache.has(id)) throw new Error("Todo not found.");
      cache.delete(id);
      save();
    },
  };
}

function loadTodos(storage: Storage, key: string): Todo[] {
  const items = storage.getItem(key);
  if (!items) return [];
  console.log(items);

  try {
    return storageSchema.parse(JSON.parse(items));
  } catch (e) {
    console.error(e);
    return [];
  }
}

function saveTodos(todos: Todo[], storage: Storage, key: string): void {
  storage.setItem(key, JSON.stringify(todos));
}
