import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Promise that resolves when Firebase Auth is ready
let authReadyPromise: Promise<void> | null = null;
let authReady = false;

function waitForAuthReady(): Promise<void> {
  if (authReady) return Promise.resolve();

  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        authReady = true;
        unsubscribe();
        resolve();
      });
      // Fallback timeout to prevent infinite waiting
      setTimeout(() => {
        authReady = true;
        resolve();
      }, 5000);
    });
  }

  return authReadyPromise;
}

async function getAuthToken(): Promise<string | null> {
  // Wait for Firebase Auth to initialize before checking currentUser
  await waitForAuthReady();

  const user = auth.currentUser;
  if (!user) {
    console.log('[Auth] No current user after auth ready');
    return null;
  }
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('[Auth] Error getting ID token:', error);
    return null;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    console.log(`[API] Attaching token to ${method} ${url} (len: ${token.length})`);
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.log(`[API] No token available for ${method} ${url}`);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        console.log(`[Query] Attaching token to ${queryKey.join("/")} (len: ${token.length})`);
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log(`[Query] No token available for ${queryKey.join("/")}`);
      }

      const res = await fetch(queryKey.join("/") as string, {
        headers,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
