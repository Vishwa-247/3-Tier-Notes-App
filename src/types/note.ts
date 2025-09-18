export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  attachmentKey?: string;
  attachmentUrl?: string;
}

export interface CreateNoteRequest {
  title: string;
  body: string;
  attachmentKey?: string;
}

export interface PresignRequest {
  filename: string;
  contentType: string;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
}

export interface NotesListResponse {
  items: Note[];
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
}