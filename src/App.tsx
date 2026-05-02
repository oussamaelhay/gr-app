import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPageComponent from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CongeForm from './pages/CongeForm';
import AttestationForm from './pages/AttestationForm';
import Layout from './components/Layout';
import type { AppPage } from './types';

export default function App() {
  const { currentUser, login, logout, register } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  if (!currentUser) {
    return <AuthPageComponent onLogin={login} onRegister={register} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={setCurrentPage} />;
      case 'conge':
        return <CongeForm user={currentUser} onBack={() => setCurrentPage('dashboard')} />;
      case 'attestation':
        return <AttestationForm user={currentUser} onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard user={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout
      user={currentUser}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={logout}
    >
      {renderPage()}
    </Layout>
  );
}
