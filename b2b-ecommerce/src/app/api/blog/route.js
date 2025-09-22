// lib/api/blogApi.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class BlogAPI {
  // Posts
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/posts?${queryString}`);
    const data = await response.json();
    return data;
  }

  async getPost(id) {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
    const data = await response.json();
    return data;
  }

  async createPost(postData) {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data;
  }

  async updatePost(id, postData) {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data;
  }

  async deletePost(id, permanent = false) {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}?permanent=${permanent}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  }

  // Media
  async getMedia(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/media?${queryString}`);
    const data = await response.json();
    return data;
  }

  async uploadMedia(files) {
    const formData = new FormData();
    
    // Handle multiple files
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('files', files);
    }

    const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data;
  }

  async createMediaFromUrl(embedData) {
    const response = await fetch(`${API_BASE_URL}/api/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(embedData)
    });
    const data = await response.json();
    return data;
  }

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/categories?${queryString}`);
    const data = await response.json();
    return data;
  }

  async createCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    return data;
  }

  // Tags
  async getTags(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/api/tags?${queryString}`);
    const data = await response.json();
    return data;
  }

  async createTag(tagData) {
    const response = await fetch(`${API_BASE_URL}/api/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData)
    });
    const data = await response.json();
    return data;
  }
}

export const blogAPI = new BlogAPI();