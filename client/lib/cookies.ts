import { cookies } from 'next/headers';

export async function setValue<T = unknown>(key: string, value: T): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, JSON.stringify(value), {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getValue<T = unknown>(key: string): Promise<T | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  return cookie ? JSON.parse(cookie.value) : undefined;
}

export async function deleteValue(key: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

export async function addToList<T = unknown>(key: string, value: T): Promise<void> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(key);
  let list: T[] = [];
  if (existingCookie) {
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

export async function getList<T = unknown>(key: string): Promise<T[]> {
  const cookieStore = await cookies();
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

export async function removeFromList<T = unknown>(key: string, value: T): Promise<void> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(key);
  if (existingCookie) {
    try {
      let list = JSON.parse(existingCookie.value) as T[];
      list = list.filter((item) => item !== value);
      cookieStore.set(key, JSON.stringify(list), {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    } catch {
      // Ignore parsing errors
    }
  }
}
