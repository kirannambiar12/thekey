"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, Role } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_USER: AuthUser = {
  id: "user-alice",
  role: "student",
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(DEFAULT_USER);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export const DEMO_USERS: Array<{ id: string; name: string; role: Role }> = [
  { id: "user-alice", name: "Alice", role: "student" },
  { id: "user-bob", name: "Bob", role: "student" },
  { id: "user-carol", name: "Carol", role: "student" },
  { id: "user-mod", name: "Morgan", role: "moderator" },
];
