import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { authService } from './auth';
import { Note, CreateNoteRequest, PresignRequest, PresignResponse, NotesListResponse, SearchParams } from '@/types/note';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Notes endpoints
  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response: AxiosResponse<Note> = await this.client.post('/notes', data);
    return response.data;
  }

  async getNotes(params?: SearchParams): Promise<NotesListResponse> {
    const response: AxiosResponse<NotesListResponse> = await this.client.get('/notes', { params });
    return response.data;
  }

  async getNoteById(id: string): Promise<Note> {
    const response: AxiosResponse<Note> = await this.client.get(`/notes/${id}`);
    return response.data;
  }

  async deleteNote(id: string): Promise<void> {
    await this.client.delete(`/notes/${id}`);
  }

  async updateNote(id: string, data: Partial<CreateNoteRequest>): Promise<Note> {
    const response: AxiosResponse<Note> = await this.client.patch(`/notes/${id}`, data);
    return response.data;
  }

  // Presigned URL for file upload
  async getPresignedUrl(noteId: string, data: PresignRequest): Promise<PresignResponse> {
    const response: AxiosResponse<PresignResponse> = await this.client.post(`/notes/${noteId}/presign`, data);
    return response.data;
  }

  // Upload file using presigned URL
  async uploadFile(uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

export const apiClient = new ApiClient();