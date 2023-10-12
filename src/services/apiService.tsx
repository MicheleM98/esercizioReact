/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { UserType } from "../utils/user-type";
import { ArticleType } from "../utils/article-type";

const baseUrl = "https://62c96230d9ead251e8baf02e.mockapi.io/campus";

interface UpdateArticleRequest {
  id: string;
  article: ArticleType;
}

interface UpdateUserRequest {
  id: string;
  user: UserType;
}

function promiseCall(apiPromise: Promise<any>): Promise<any> {
  return new Promise((resolve) => {
    (async () => {
      const results = await apiPromise;
      return resolve(results.data);
    })();
  });
}
class ApiService {
  getUsers(): Promise<UserType[]> {
    return promiseCall(axios.get(`${baseUrl}/users`));
  }

  createUser(user: UserType): Promise<UserType> {
    return promiseCall(axios.post(`${baseUrl}/users`, user));
  }

  getUserById(id: string): Promise<UserType> {
    return promiseCall(axios.get(`${baseUrl}/users/${id}`));
  }

  updateUser(updateUserRequest: UpdateUserRequest): Promise<UserType> {
    return promiseCall(
      axios.put(
        `${baseUrl}/users/${updateUserRequest.id}`,
        updateUserRequest.user
      )
    );
  }

  deleteUser(id: string): Promise<void> {
    return promiseCall(axios.delete(`${baseUrl}/users/${id}`));
  }

  getArticles(): Promise<ArticleType[]> {
    return promiseCall(axios.get(`${baseUrl}/articles`));
  }

  createArticle(article: ArticleType): Promise<ArticleType> {
    return promiseCall(axios.post(`${baseUrl}/articles`, article));
  }

  getArticleById(id: string): Promise<ArticleType> {
    return promiseCall(axios.get(`${baseUrl}/articles/${id}`));
  }

  updateArticle(
    updateArticleRequest: UpdateArticleRequest
  ): Promise<ArticleType> {
    return promiseCall(
      axios.put(
        `${baseUrl}/articles/${updateArticleRequest.id}`,
        updateArticleRequest.article
      )
    );
  }

  deleteArticle(id: string): Promise<void> {
    return promiseCall(axios.delete(`${baseUrl}/articles/${id}`));
  }
}

export default new ApiService();
