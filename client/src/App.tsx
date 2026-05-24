import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkspacesPage from "./pages/WorkspacesPage";
import AppLayout from "./components/AppLayout";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WorkspacesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WorkspacePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
