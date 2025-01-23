import { makeObservable, observable, action } from 'mobx';
import { blogApi } from '../services/api';

class AuthStore {
  user = null;
  profile = null;
  loading = true;
  error = null;
  isEditingProfile = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      profile: observable,
      loading: observable,
      error: observable,
      isEditingProfile: observable,
      checkUser: action,
      login: action,
      logout: action,
      setEditingProfile: action,
      updateProfile: action
    });
  }

  async checkUser() {
    try {
      const currentUser = await blogApi.auth.getCurrentUser();
      
      this.user = currentUser;

      if (currentUser) {
        const profileData = await blogApi.getProfile();
        this.profile = profileData;
      }
    } catch (error) {
      this.error = error.message;
      this.user = null;
      this.profile = null;
    } finally {
      this.loading = false;
    }
  }

  async login(email, password) {
    try {
      await blogApi.auth.signIn(email, password);
      await this.checkUser();
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  }

  async logout() {
    try {
      await blogApi.auth.signOut();
      this.user = null;
      this.profile = null;
    } catch (error) {
      this.error = error.message;
    }
  }

  setEditingProfile = (isEditing) => {
    this.isEditingProfile = isEditing;
  };

  updateProfile = async (profileData) => {
    this.loading = true;
    try {
      const updatedProfile = await blogApi.updateProfile(profileData);
      this.profile = updatedProfile;
      this.isEditingProfile = false;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  };
}

export const authStore = new AuthStore(); 