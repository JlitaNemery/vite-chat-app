import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTE_BASE, ROUTE_CHAT_ROOM, ROUTE_LOGIN, ROUTE_SIGNUP } from './common/consts';
import { Spinner, Center } from '@chakra-ui/react';
import './index.scss';

const Home = lazy(() => import('./pages/Home'));
const AuthForm = lazy(() => import('./pages/AuthForm'));
const Header = lazy(() => import('./components/Header'));

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Suspense
              fallback={
                <Center h="100vh">
                  <Spinner size="xl" />
                </Center>
              }
            >
              <Header />
              <Routes>
                <Route path={ROUTE_LOGIN} element={<AuthForm />} />
                <Route path={ROUTE_SIGNUP} element={<AuthForm />} />
                <Route
                  path={ROUTE_BASE}
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTE_CHAT_ROOM}
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
