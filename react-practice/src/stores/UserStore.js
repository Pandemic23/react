import { makeObservable, observable, action } from 'mobx';
import { blogApi } from '../services/api';

class UserStore {
  users = new Map(); // 사용자 ID를 키로 하는 Map
  loading = false;
  error = null;

  constructor() {
    makeObservable(this, {
      users: observable,
      loading: observable,
      error: observable,
      loadUser: action,
      setUser: action
    });
  }

  async loadUser(userId) {
    // 이미 로드된 사용자인 경우 캐시된 데이터 반환
    if (this.users.has(userId)) {
      return this.users.get(userId);
    }

    this.loading = true;
    try {
      const { data, error } = await blogApi
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;

      this.setUser(userId, data);
      return data;
    } catch (error) {
      console.error('사용자 정보 로드 에러:', error);
      this.error = error.message;
      return null;
    } finally {
      this.loading = false;
    }
  }

  setUser(userId, userData) {
    this.users.set(userId, userData);
  }

  getUser(userId) {
    return this.users.get(userId);
  }
}

export const userStore = new UserStore(); 