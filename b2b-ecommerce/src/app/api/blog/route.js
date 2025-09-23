// lib/api/blogApi.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class BlogAPI {
  // Posts
  async getPosts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/posts?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.posts || data, error: null };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async getPost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.post || data, error: null };
    } catch (error) {
      console.error('Error fetching post:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.post || data, error: null };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async updatePost(id, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.post || data, error: null };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async deletePost(id, permanent = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}?permanent=${permanent}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data, error: null };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  // Media
  async getMedia(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/media?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.media || data, error: null };
    } catch (error) {
      console.error('Error fetching media:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async uploadMedia(files) {
    try {
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.files || data, error: null };
    } catch (error) {
      console.error('Error uploading media:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async createMediaFromUrl(embedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(embedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.media || data, error: null };
    } catch (error) {
      console.error('Error creating media from URL:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  // Categories
  async getCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/categories?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.categories || data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.category || data, error: null };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  // Tags
  async getTags(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/tags?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.tags || data, error: null };
    } catch (error) {
      console.error('Error fetching tags:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  async createTag(tagData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.tag || data, error: null };
    } catch (error) {
      console.error('Error creating tag:', error);
      return { success: false, data: null, error: error.message };
    }
  }
}

export const blogAPI = new BlogAPI();