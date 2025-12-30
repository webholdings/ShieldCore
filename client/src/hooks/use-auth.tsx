import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<any, Error, LoginData>;
  loginWithGoogleMutation: UseMutationResult<any, Error, void>;
  logoutMutation: UseMutationResult<any, Error, void>;
  registerMutation: UseMutationResult<any, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoadingFirebase, setIsLoadingFirebase] = useState<boolean>(true);

  // Query to fetch user data from backend using the token
  const { data: user, isLoading: isLoadingUser, error } = useQuery<SelectUser | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      if (!firebaseUser) return null;
      try {
        console.log("[useAuth] Fetching user data from /api/user for uid:", firebaseUser.uid);
        const res = await apiRequest("GET", "/api/user");
        const data = await res.json();
        console.log("[useAuth] User data received:", data);
        return data;
      } catch (err) {
        console.error("[useAuth] Error fetching user data:", err);
        // If 401 or 404, return null (user not found in DB or invalid token)
        return null;
      }
    },
    enabled: !!firebaseUser, // Only fetch if Firebase user exists
    retry: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setIsLoadingFirebase(false);
    });
    return () => unsubscribe();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
      // Backend sync happens automatically via useQuery when firebaseUser updates
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: async () => {
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Google Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email || "", credentials.password);

      // We still need to create the user in the backend DB
      // But we do it via a dedicated registration endpoint that verifies the token
      // Or we can rely on /api/user to create it if missing? 
      // Better to have explicit registration.
      // For now, let's assume /api/user creates it or we call a register endpoint.
      // Let's call /api/register which will verify token and create user.

      const res = await apiRequest("POST", "/api/register", {
        ...credentials,
        uid: userCredential.user.uid // Pass UID explicitly or let backend extract from token
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Registration successful",
        description: "Welcome!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      setFirebaseUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = isLoadingFirebase || (!!firebaseUser && isLoadingUser);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        loginWithGoogleMutation,
        registerMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
