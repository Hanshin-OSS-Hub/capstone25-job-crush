import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const AuthSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
      aria-label="로딩 중"
    />
  </div>
);

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthSpinner />;
  }
  if (!user) {
    // [임시 비활성화]
    // return <Navigate to="/landing" replace />;
    return <>{children}</>;
  }
  return <>{children}</>;
}
