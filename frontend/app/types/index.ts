export interface LoginResponse {
  access_token?: string;
}
export interface Post {
  id: string;
  title: string;
  slug?: string | null;
  image?: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface AdminListResp {
  items: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
