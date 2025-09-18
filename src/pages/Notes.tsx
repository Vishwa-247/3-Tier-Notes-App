import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { NoteCard } from '@/components/NoteCard';
import { NotesListSkeleton } from '@/components/LoadingStates';
import { Button } from '@/components/ui/button';
import { useNotes, useDeleteNote } from '@/hooks/useNotes';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  
  const { data: notesData, isLoading, error } = useNotes({ q: searchQuery });
  const deleteNoteMutation = useDeleteNote();

  const filteredNotes = useMemo(() => {
    if (!notesData?.items) return [];
    if (!searchQuery.trim()) return notesData.items;

    const query = searchQuery.toLowerCase();
    return notesData.items.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.body.toLowerCase().includes(query)
    );
  }, [notesData?.items, searchQuery]);

  const handleDelete = (noteId: string) => {
    setDeleteNoteId(noteId);
  };

  const confirmDelete = () => {
    if (deleteNoteId) {
      deleteNoteMutation.mutate(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error loading notes</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load notes'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredNotes.length} notes found`}
            </p>
          </div>
          <Button asChild>
            <Link to="/notes/create">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <NotesListSkeleton />
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started'}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link to="/notes/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Note
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Notes;