/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import PostureModule from './components/PostureModule';

type View = 'home' | 'dashboard' | 'squat' | 'lunges' | 'core';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; role: 'student' | 'admin' } | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  // Check for saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('hdfitness_user');
    const savedRole = localStorage.getItem('hdfitness_role') as 'student' | 'admin';
    const loggedIn = localStorage.getItem('hdfitness_logged_in') === 'true';

    if (loggedIn && savedUser) {
      setUser({ name: savedUser, role: savedRole });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string, role: 'student' | 'admin') => {
    localStorage.setItem('hdfitness_user', name);
    localStorage.setItem('hdfitness_role', role);
    localStorage.setItem('hdfitness_logged_in', 'true');
    setUser({ name, role });
    setIsLoggedIn(true);
    if (role === 'admin') setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.setItem('hdfitness_logged_in', 'false');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard userName={user?.name || ''} onBack={() => setCurrentView('home')} />;
  }

  if (['squat', 'lunges', 'core'].includes(currentView)) {
    return (
      <PostureModule 
        type={currentView as 'squat' | 'lunges' | 'core'} 
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  return (
    <Home 
      userName={user?.name || ''} 
      role={user?.role || 'student'} 
      onLogout={handleLogout} 
      onNavigate={setCurrentView}
    />
  );
}
