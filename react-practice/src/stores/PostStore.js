import { makeObservable, observable, action } from 'mobx';
import { blogApi } from '../services/api';

class PostStore {
  posts = [];
  totalPages = 1;
  currentPage = 1;
  loading = false;
  error = null;

  constructor() {
    makeObservable(this, {
      posts: observable,
      totalPages: observable,
      currentPage: observable,
      loading: observable,
      error: observable,
      loadPosts: action,
      setPage: action,
      createPost: action,
      updatePost: action
    });
  }

  async loadPosts(page) {
    this.loading = true;
    this.error = null;
    
    try {
      const { content, totalPages } = await blogApi.getPosts(page - 1);
      this.posts = content;
      this.totalPages = totalPages;
      this.currentPage = page;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  setPage(page) {
    this.currentPage = page;
    this.loadPosts(page);
  }

  async createPost(postData, imageFile) {
    this.loading = true;
    this.error = null;
    
    try {
      await blogApi.createPost(postData, imageFile);
      await this.loadPosts(1); // 첫 페이지로 이동
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async updatePost(postId, postData, imageFile) {
    this.loading = true;
    this.error = null;
    
    try {
      await blogApi.updatePost(postId, postData, imageFile);
      await this.loadPosts(this.currentPage);
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }
}

export const postStore = new PostStore(); 