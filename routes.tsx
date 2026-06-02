import { RouteObject } from 'react-router-dom';
import HomePage from './pages/index';
import ShopPage from './pages/shop';
import ProductDetailPage from './pages/products/[id]';
import DropsPage from './pages/drops';
import CartPage from './pages/cart';
import CheckoutPage from './pages/checkout';
import AboutPage from './pages/about';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import AccountPage from './pages/account/index';
import { ProtectedRoute } from './lib/auth/auth-client';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/shop',
    element: <ShopPage />,
  },
  {
    path: '/collections',
    element: <ShopPage />,
  },
  {
    path: '/products/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/drops',
    element: <DropsPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/account',
    element: <ProtectedRoute><AccountPage /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/shop' | '/collections' | '/products/:id' | '/drops' | '/cart' | '/checkout' | '/about' | '/login' | '/signup' | '/account';

export type Params = Record<string, string | undefined>;
