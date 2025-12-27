/**
 * A simple interface representing a read-only cookie store.
 */
interface ReadonlyCookieStore {
  get(key: string): { value: string } | undefined;
}

/**
 * A simple interface representing a writable cookie store.
 */
interface CookieStore extends ReadonlyCookieStore {
  set(
    key: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      path?: string;
      maxAge?: number;
    }
  ): void;
  delete(key: string): void;
}

/**
 * Sets a cookie with the given key and value. The value is serialized to JSON before being stored.
 * @param key - The key of the cookie.
 * @param value - The value to be stored in the cookie.
 * @param cookieStore - The cookie store where the cookie will be set.
 */
export function setValue<T = unknown>(key: string, value: T, cookieStore: CookieStore): void {
  cookieStore.set(key, JSON.stringify(value), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}

/**
 * Retrieves a value from the cookie store by its key. The value is parsed from JSON before being returned.
 * @param key - The key of the cookie.
 * @param cookieStore - The cookie store from which the cookie will be retrieved.
 * @returns The parsed value from the cookie, or undefined if the cookie does not exist or parsing fails.
 */
export function getValue<T = unknown>(
  key: string,
  cookieStore: ReadonlyCookieStore
): T | undefined {
  const cookie = cookieStore.get(key);
  try {
    return cookie ? (JSON.parse(cookie.value) as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Deletes a cookie with the given key from the cookie store.
 * @param key - The key of the cookie to be deleted.
 * @param cookieStore - The cookie store from which the cookie will be deleted.
 */
export function deleteValue(key: string, cookieStore: CookieStore): void {
  cookieStore.delete(key);
}

/**
 * Adds a value to a list stored in a cookie. If the list does not exist, it is created.
 * The value is only added if it is not already present in the list.
 * @param key - The key of the cookie.
 * @param value - The value to be added to the list.
 * @param cookieStore - The cookie store where the list is stored.
 * @param prevList - An optional previous list to use instead of reading from the cookie.
 */
export function addToList<T = unknown>(
  key: string,
  value: T,
  cookieStore: CookieStore,
  prevList: T[] | undefined = undefined
): void {
  let list: T[] = [];
  if (prevList) {
    list = prevList;
  } else {
    const existingCookie = cookieStore.get(key);
    if (existingCookie)
      try {
        list = JSON.parse(existingCookie.value) as T[];
      } catch {
        // Ignore parsing errors and start with an empty list
      }
  }
  list = list.filter((item) => item !== value);
  list.push(value);
  cookieStore.set(key, JSON.stringify(list), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}

/**
 * Retrieves a list of values from a cookie. If the cookie does not exist or cannot be parsed, an empty list is returned.
 * @param key - The key of the cookie.
 * @param cookieStore - The cookie store from which the list will be retrieved.
 * @returns An array of values stored in the cookie.
 */
export function getList<T = unknown>(key: string, cookieStore: ReadonlyCookieStore): T[] {
  const existingCookie = cookieStore.get(key);
  if (existingCookie) {
    try {
      return JSON.parse(existingCookie.value) as T[];
    } catch {
      // Ignore parsing errors and return an empty list
    }
  }
  return [];
}

/**
 * Removes a value from a list stored in a cookie. If the list does not exist or the value is not found, no action is taken.
 * @param key - The key of the cookie.
 * @param value - The value to be removed from the list.
 * @param cookieStore - The cookie store where the list is stored.
 * @param prevList - An optional previous list to use instead of reading from the cookie.
 */
export function removeFromList<T = unknown>(
  key: string,
  value: T,
  cookieStore: CookieStore,
  prevList: T[] | undefined = undefined
): void {
  let list: T[] = [];
  if (prevList) {
    list = prevList;
  } else {
    const existingCookie = cookieStore.get(key);
    if (existingCookie) {
      try {
        list = JSON.parse(existingCookie.value) as T[];
      } catch {
        return;
      }
    } else {
      return;
    }
  }
  list = list.filter((item) => item !== value);
  cookieStore.set(key, JSON.stringify(list), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
