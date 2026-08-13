import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { useAuth } from '@/lib/use-auth';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import { SearchProvider } from '@/lib/SearchContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Lookbook from '@/pages/Lookbook';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Cart from '@/pages/Cart';
import Admin from '@/pages/Admin';
import Drop from '@/pages/Drop';
import TrackOrder from '@/pages/TrackOrder';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Account from '@/pages/Account';
import CustomerOrders from '@/pages/CustomerOrders';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-orders" element={<CustomerOrders />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="/drop" element={<Drop />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


import { CurrencyProvider } from '@/context/CurrencyContext';
import CurrencySelectorModal from '@/components/CurrencySelectorModal';

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <SearchProvider>
                <Router>
                  <ScrollToTop />
                  <AuthenticatedApp />
                  <CurrencySelectorModal />
                </Router>
                <Toaster />
              </SearchProvider>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
