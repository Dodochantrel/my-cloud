export function updateById<T extends { id: number }>(
  array: T[],
  id: number,
  updates: Partial<T>
): T[] {
  return array.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function removeById<T extends { id: number }>(
  array: T[],
  id: number
): T[] {
  return array.filter((item) => item.id !== id);
}

export function removeByIdWithRecurtion<T extends { id: number }>(
  array: T[],
  id: number
): T[] {
  return array
    .filter((item) => item.id !== id)
    .map((item: any) => ({
      ...item,
      childrens: item.childrens
        ? removeByIdWithRecurtion(item.childrens, id)
        : [],
    }));
}

export function addOne<T>(array: T[], item: T): T[] {
  return [item, ...array];
}

export function addMany<T>(array: T[], items: T[]): T[] {
  return [...items, ...array];
}

export function clear<T>(): T[] {
  return [];
}

export function findOneById<T extends { id: number }>(
  array: T[],
  id: number
): T | undefined {
  return array.find((item) => item.id === id);
}

export function findIndexById<T extends { id: number }>(
  array: T[],
  id: number
): number {
  return array.findIndex((item) => item.id === id);
}
