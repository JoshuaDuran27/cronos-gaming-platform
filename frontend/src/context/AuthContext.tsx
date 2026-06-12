import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axiosClient from "../api/axiosClient";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;

      try {
        const response = await axiosClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Sesión inválida:", error);
        logout();
      }
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });

    const accessToken = response.data.accessToken;

    localStorage.setItem("accessToken", accessToken);

    setToken(accessToken);
    setUser(response.data.user);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    await axiosClient.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}