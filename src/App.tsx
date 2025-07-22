import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ImportLogs from "./pages/ImportLogs";
import EventHistory from "./pages/EventHistory";
import RoomMapping from "./pages/RoomMapping";
import WebhookEvents from "./pages/WebhookEvents";
import VMSSync from "./pages/VMSSync";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from "@/components/routing/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (token && isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* If already logged in and hit /login, redirect to /dashboard */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logs"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ImportLogs />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EventHistory />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mappings"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RoomMapping />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/webhooks"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <WebhookEvents />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sync"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <VMSSync />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
