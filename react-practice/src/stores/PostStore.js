import { makeAutoObservable, runInAction } from 'mobx';
import { blogApi } from '../services/api';

class PostStore {
  posts = [];
  totalPages = 0;
  currentPage = 0;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadPosts(page = 0) {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await blogApi.getPosts(page);
      runInAction(() => {
        this.posts = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = page;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createPost(postData, imageFile) {
    this.loading = true;
    this.error = null;

    try {
      await blogApi.createPost(postData, imageFile);
      await this.loadPosts(0); // 첫 페이지로 돌아가서 새로운 글 포함하여 로드
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updatePost(postId, postData, imageFile) {
    this.loading = true;
    this.error = null;

    try {
      await blogApi.updatePost(postId, postData, imageFile);
      await this.loadPosts(this.currentPage); // 현재 페이지 리로드
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const postStore = new PostStore(); 