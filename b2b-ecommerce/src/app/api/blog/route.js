// lib/blogAPI.js - API client for blog operations
class BlogAPI {
  constructor() {
    this.baseURL = '/api';
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Posts
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  async getPost(id) {
    return this.request(`/posts/${id}`);
  }

  async createPost(data) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(id, data) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id, permanent = false) {
    return this.request(`/posts/${id}${permanent ? '?permanent=true' : ''}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ''}`);
  }

  async createCategory(data) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tags
  async getTags(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tags${queryString ? `?${queryString}` : ''}`);
  }

  async createTag(data) {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Media
  async getMedia(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/media${queryString ? `?${queryString}` : ''}`);
  }

  async createMediaFromUrl(data) {
    return this.request('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadMedia(files) {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const blogAPI = new BlogAPI();
export default blogAPI;