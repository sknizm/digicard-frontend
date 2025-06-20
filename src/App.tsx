// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense, useContext } from 'react';// Recommended for au
import BouncingDotsLoader from './components/ui/bounce-loader';
import MenuListPage from './pages/dashboard/allmenus';
import MenuItemForm from './pages/dashboard/addmenu';
import HomePage from './pages/main-site/HomePage';
import { AppContext } from './context/AppContext';
import { AdminPage } from './pages/adminboard/AdminPage';
import { OverviewPage } from './pages/adminboard/OverViewPage';
import { UsersPage } from './pages/adminboard/UsersPage';
import MembershipsPage from './pages/adminboard/MembershipPage';
import { config } from './lib/config';
import Membership from './pages/dashboard/membership';
import BulkMenuItemForm from './pages/dashboard/bulkadd';
import BusinessCard from './pages/public-site/CardPage';
import CardSettingsPage from './pages/dashboard/setting';

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
              <Route path="menu" element={<MenuListPage />} />
              <Route path="menu/create" element={<MenuItemForm />} />
              <Route path="menu/create/:id" element={<MenuItemForm />} />
              <Route path="membership" element={<Membership />} />
              <Route path="bulk-add" element={<BulkMenuItemForm />} />
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
              <Route path="memberships" element={<MembershipsPage />} />
              <Route path="menu/create/:id" element={<MenuItemForm />} />
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