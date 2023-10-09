import axios from "axios";

const baseUrl = "https://62c96230d9ead251e8baf02e.mockapi.io/campus";

interface User {
  createdAt: string;
  name: string;
  avatar: string;
  birthdate: string;
  articlesIds: Array<number>;
  id: string;
}

interface Article {
  createdAt: string;
  name: string;
  picture: string;
  sellerId: string | number;
  description: string;
  buyUrl: string;
  id: string;
}

interface UpdateArticleRequest {
  id: string;
  article: Article;
}

interface UpdateUserRequest {
  id: string;
  user: User;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function promiseCall(apiPromise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const results = await apiPromise;
        return resolve(results.data);
      } catch (err) {
        return reject(err);
      }
    })();
  });
}
class ApiService {
  getUsers(): Promise<User[]> {
    return promiseCall(axios.get(`${baseUrl}/users`));
  }

  createUser(user: User): Promise<User> {
    return promiseCall(axios.post(`${baseUrl}/users`, user));
  }

  updateUser(updateUserRequest: UpdateUserRequest): Promise<User> {
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

  getArticles(): Promise<Article[]> {
    return promiseCall(axios.get(`${baseUrl}/articles`));
  }

  createArticle(article: Article): Promise<Article> {
    return promiseCall(axios.post(`${baseUrl}/articles`, article));
  }

  updateArticle(updateArticleRequest: UpdateArticleRequest): Promise<Article> {
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
