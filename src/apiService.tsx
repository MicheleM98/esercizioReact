import axios, { AxiosResponse } from 'axios';

const baseUrl = 'https://62c96230d9ead251e8baf02e.mockapi.io/campus';

interface User {
    createdAt: string,
    name: string,
    avatar: string,
    birthdate: string,
    articlesIds: Array<number>,
    id: string
}

interface Article {
    createdAt: string,
    name: string,
    picture: string,
    sellerId: string | number,
    description: string,
    buyUrl: string,
    id: string
}

class ApiService {
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await axios.get(`${baseUrl}/users`);
    return response.data;
  }

  async createUser(user: User): Promise<User> {
    const response: AxiosResponse<User> = await axios.post(`${baseUrl}/users`, user);
    return response.data;
  }

  async updateUser(id: string, user: User): Promise<User> {
    const response: AxiosResponse<User> = await axios.put(`${baseUrl}/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/users/${id}`);
  }

  async getArticles(): Promise<Article[]> {
    const response: AxiosResponse<Article[]> = await axios.get(`${baseUrl}/articles`);
    return response.data;
  }

  async createArticle(article: Article): Promise<Article> {
    const response: AxiosResponse<Article> = await axios.post(`${baseUrl}/articles`, article);
    return response.data;
  }

  async updateArticle(id: string, article: Article): Promise<Article> {
    const response: AxiosResponse<Article> = await axios.put(`${baseUrl}/articles/${id}`, article);
    return response.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/articles/${id}`);
  }
}

export default new ApiService();