// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense, useContext } from 'react';// Recommended for au
import BouncingDotsLoader from './components/ui/bounce-loader';
import HomePage from './pages/main-site/HomePage';
import { AppContext } from './context/AppContext';
import { AdminPage } from './pages/adminboard/AdminPage';
import { OverviewPage } from './pages/adminboard/OverViewPage';
import { UsersPage } from './pages/adminboard/UsersPage';
import { config } from './lib/config';
import Membership from './pages/dashboard/membership';
import BusinessCard from './pages/public-site/CardPage';
import CardSettingsPage from './pages/dashboard/setting';
import ServiceManagerPage from './pages/dashboard/add-services';
import ServicesPage from './pages/dashboard/all-services';

// Lazy load pages for performance
const SignInPage = lazy(() => import('@/pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard'));
const DashboardHomePage = lazy(() => import('@/pages/dashboard/homepage'));

function App() {
  const context = useContext(AppContext);
  const user = context?.user;
  const isAdmin = user?.email === config.admin_email;


  return (


    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={<BouncingDotsLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
              path="/:slug"
              element={
                <BusinessCard />
              }
            />


            {/* Main Site */}

            <Route path="/" element={<HomePage />} />

            {/* Protected Onboarding Route */}
            <Route
              path="/onboarding"
              element={user ?
                <OnboardingPage /> : <SignUpPage />
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                user ?
                  <DashboardPage /> : <SignInPage />
              }
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<DashboardHomePage />} />
              <Route path="add-new" element={<ServiceManagerPage />} />
              <Route path="edit/:id" element={<ServiceManagerPage />} />
              <Route path="all-services" element={<ServicesPage />} />
              <Route path="membership" element={<Membership />} />
              <Route path="restaurant" element={<CardSettingsPage />} />
            </Route>

            {/* Root Redirect */}



            {/* Protected Dashboard Routes */}
            <Route
              path="/adminboard"
              element={
                isAdmin ?
                  <AdminPage /> : <SignInPage />
              }
            >
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="restaurant" element={<CardSettingsPage/>} />
            </Route>

            {/* Root Redirect */}


            {/* <Route path="/" element={<Navigate to="/dashboard/home" replace />} /> */}

            {/* 404 Route */}
            {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
          </Routes>
        </Suspense>

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;