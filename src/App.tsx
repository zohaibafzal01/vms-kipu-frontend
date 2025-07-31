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
import PatientHistory from "./pages/PatientHistory";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Route */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Login />
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
                path="/patients"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PatientHistory />
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Root Redirect */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
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
