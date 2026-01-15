import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PoliciesPage from '@/pages/PoliciesPage';
import CreatePolicyPage from '@/pages/CreatePolicyPage';
import PolicyDetailPage from '@/pages/PolicyDetailPage';
import DataCollectionPage from '@/pages/DataCollectionPage';

import ImplementationPage from '@/pages/ImplementationPage';
import ImihigoPage from '@/pages/ImihigoPage';
import MonitoringPage from '@/pages/MonitoringPage';
import CitizenFeedbackPage from '@/pages/CitizenFeedbackPage';
import LegalCabinetPage from '@/pages/LegalCabinetPage';
import CreateAccountPage from '@/pages/CreateAccountPage';
import CreateProjectPage from '@/pages/CreateProjectPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policies"
        element={
          <ProtectedRoute>
            <PoliciesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policies/create"
        element={
          <ProtectedRoute>
            <CreatePolicyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policies/:id"
        element={
          <ProtectedRoute>
            <PolicyDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/data-collection"
        element={
          <ProtectedRoute>
            <DataCollectionPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/implementation"
        element={
          <ProtectedRoute>
            <ImplementationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/imihigo"
        element={
          <ProtectedRoute>
            <ImihigoPage />
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <MonitoringPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen-feedback"
        element={
          <ProtectedRoute>
            <CitizenFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/legal-cabinet"
        element={
          <ProtectedRoute>
            <LegalCabinetPage />
          </ProtectedRoute>
        }
      />

      <Route path="/create-account" element={<CreateAccountPage />} />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
