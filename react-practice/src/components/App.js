import '../css/App.css';
import { useState, useEffect } from 'react';
import { blogApi } from '../services/api';
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';
import { postStore } from '../stores/PostStore';
import { authStore } from '../stores/AuthStore';
import MainLayout from './layout/MainLayout';
import PostList from './PostList';

const App = observer(() => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    authStore.checkUser();
  }, []);

  useEffect(() => {
    if (authStore.user) {
      postStore.loadPosts(postStore.currentPage);
    }
  }, [authStore.user]);

  const handleProfileSave = async (newProfile) => {
    try {
      await blogApi.updateProfile(newProfile);
      const updatedProfile = await blogApi.getProfile();
      authStore.profile = updatedProfile;
      setIsEditingProfile(false);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
    }
  };

  const handleLoginSuccess = () => {
    authStore.checkUser();
  };

  const handleLogout = async () => {
    try {
      await blogApi.auth.signOut();
      authStore.logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };


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
      <PostList />
    </MainLayout>
  );
});


export default App;



