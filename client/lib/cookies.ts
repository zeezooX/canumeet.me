interface ReadonlyCookieStore {
  get(key: string): { value: string } | undefined;
}

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

export function setValue<T = unknown>(key: string, value: T, cookieStore: CookieStore): void {
  cookieStore.set(key, JSON.stringify(value), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}

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

export function deleteValue(key: string, cookieStore: CookieStore): void {
  cookieStore.delete(key);
}

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
  if (!list.includes(value)) list.push(value);
  cookieStore.set(key, JSON.stringify(list), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}

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
