import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './components/Context/AuthContext';
import { ResultsProvider } from './components/Context/ResultsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/home/Footer';
import Home from './components/home/Home';
import About from './pages/About';
import BloodPressure from './pages/BloodPressure';
import HeartAssessment from './pages/Heart';
import Diabetes from './pages/Diabetes';
import Prevention from './pages/Prevention';
import Resources from './pages/Resources';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ChatInterface from './components/ChatInterface';
import NutritionChecker from './pages/NutritionChecker';
import Anemia from './pages/Anemia';
import ForgotPasswordPage from './components/auth/ForgotPassword';
import ResetPasswordPage from './components/auth/ResetPassword';
import StatisticsPage from './pages/StatisticsPage';
import ContactUs from './pages/ContactUs';
import UserProfile from './components/auth/UserProfile';
import UserHistory from './components/auth/UserHistory';
import CommunityPage from './pages/CommunityPage';
import ToastContainer from './ToastContainer';
import { UserProvider } from './components/Context/UserContext.context'; // Correct import for UserContext
// import VerifyEmailPage from './pages/VerifyEmailPage';

const AppContent: React.FC = () => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header />
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Redirect to home if already authenticated */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
          
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/communitypage" element={<CommunityPage />} />


          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/history" element={<UserHistory />} />
            <Route path="/blood-pressure" element={<BloodPressure />} />
            <Route path="/heartAssessment" element={<HeartAssessment />} />
            <Route path="/diabetes" element={<Diabetes />} />
            <Route path="/anemia" element={<Anemia />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/nutrition-checker" element={<NutritionChecker />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/toastContainer" element={<ToastContainer />} />
            {/* <Route path="/VerifyEmailPage" element={<VerifyEmailPage />} /> */}

            
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ResultsProvider>
          <UserProvider> {/* Wrap everything inside UserProvider */}
            <AppContent />
          </UserProvider>
        </ResultsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
