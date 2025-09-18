import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Note, CreateNoteRequest, SearchParams } from '@/types/note';
import { toast } from '@/hooks/use-toast';

export const useNotes = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => apiClient.getNotes(params),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => apiClient.getNoteById(id),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => apiClient.createNote(data),
    onSuccess: (newNote) => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Note created',
        description: 'Your note has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating note',
        description: error.response?.data?.message || 'Failed to create note',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNoteRequest> }) =>
      apiClient.updateNote(id, data),
    onSuccess: (updatedNote) => {
      // Update the specific note in cache
      queryClient.setQueryData(['note', updatedNote.id], updatedNote);
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Note updated',
        description: 'Your note has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating note',
        description: error.response?.data?.message || 'Failed to update note',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteNote(id),
    onSuccess: () => {
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting note',
        description: error.response?.data?.message || 'Failed to delete note',
        variant: 'destructive',
      });
    },
  });
};