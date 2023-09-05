export interface UpsertOption<T extends Record<string, unknown>, K extends keyof T> {
  id: K;
  maxLength?: number;
}

export interface UpsertStrcut<T> {
  dict: Record<string, T>;
  list: T[];
}

/**
 * Example:
 * const [initialMessages, upsertMessage] = upsert<MessageInfo, 'msgID'>({ id: 'msgID' });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function upsert<T extends Record<string, any>, K extends keyof T>({ id, maxLength }: UpsertOption<T, K>) {
  const initialValue: UpsertStrcut<T> = { dict: {}, list: [] };

  const upsert = (item: T) => {
    return ({ dict, list }: typeof initialValue) => {
      const key = item[id] as string;
      const exists = dict[item[id] as string];

      if (exists) {
        return { dict: { ...dict, [key]: item }, list: list.map(i => (i[id] === key ? item : i)) };
      } else {
        if (maxLength && list.length >= maxLength) {
          const [first, ...newList] = [...list];
          const { [first[id] as string]: removed, ...newDict } = dict; // eslint-disable-line
          list = newList;
          dict = newDict;
        }
        return { dict: { ...dict, [key]: item }, list: [...list, item] };
      }
    };
  };

  return [initialValue, upsert] as const;
}
