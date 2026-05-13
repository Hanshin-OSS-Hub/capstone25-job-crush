import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  apiClient,
  clearStoredAccessToken,
  getStoredAccessToken,
  persistAccessToken,
} from "@/api/client";
import { API_ENDPOINTS } from "@/constants/api";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>({
    id: 1,
    email: "tjdwoduf0607@naver.com",
    name: "성재열",
  });

  // [임시 수정] 로딩 상태를 false로 시작하여 즉시 화면이 보이게 합니다.
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    // [임시 비활성화] 백엔드 요청 로직을 잠시 멈춥니다.
    /*
    const token = getStoredAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.ME);
      setUser(data);
      localStorage.setItem("jobcrush_user", JSON.stringify(data));
    } catch {
      setUser(null);
      localStorage.removeItem("jobcrush_user");
      clearStoredAccessToken();
    } finally {
      setIsLoading(false);
    }
    */
  }, []);

  const setSession = useCallback((nextUser: AuthUser, accessToken: string) => {
    persistAccessToken(accessToken);
    localStorage.setItem("jobcrush_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAccessToken();
    localStorage.removeItem("jobcrush_user");
    setUser(null);
    // 로그아웃 시에도 개발 편의를 위해 페이지가 유지되도록 하려면 위 setUser(null)을 주석 처리하세요.
  }, []);

  useEffect(() => {
    // [임시 비활성화] 첫 로드 시 유저 정보를 서버에서 가져오지 않습니다.
    // void refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshUser,
      setSession,
      logout,
    }),
    [user, isLoading, refreshUser, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
