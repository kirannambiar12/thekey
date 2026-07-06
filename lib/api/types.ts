export interface Course {
  id: string;
  name: string;
}

export interface ApiPost {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  hasSaved: boolean;
  savesCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SavePostResponse {
  postId: string;
  hasSaved: boolean;
  savesCount: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
  };
}
