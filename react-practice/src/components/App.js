import '../css/App.css';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';
import { postStore } from '../stores/PostStore';
import { authStore } from '../stores/AuthStore';
import MainLayout from './layout/MainLayout';

const App = observer(() => {
  useEffect(() => {
    authStore.checkUser();
  }, []);

  useEffect(() => {
    if (authStore.user) {
      postStore.loadPosts(postStore.currentPage);
    }
  }, [authStore.user]);

  if (authStore.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!authStore.user) {
    return <LoginForm onLoginSuccess={() => authStore.checkUser()} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
});

export default App;



