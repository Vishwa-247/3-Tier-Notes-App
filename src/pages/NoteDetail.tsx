import { Link, useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { NoteDetailSkeleton } from '@/components/LoadingStates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNote, useDeleteNote } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Download, Paperclip } from 'lucide-react';
import { SummarizeButton } from '@/components/SummarizeButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: note, isLoading, error } = useNote(id!);
  const deleteNoteMutation = useDeleteNote();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        absolute: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch {
      return { relative: 'Unknown date', absolute: 'Unknown date' };
    }
  };

  const handleDelete = async () => {
    if (id) {
      deleteNoteMutation.mutate(id);
      navigate('/notes');
    }
  };

  const handleDownload = (url: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'attachment';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Layout>
        <NoteDetailSkeleton />
      </Layout>
    );
  }

  if (error || !note) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Note not found</h2>
          <p className="text-muted-foreground mb-4">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link to="/notes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const dateInfo = formatDate(note.createdAt);
  const isImage = note.attachmentKey?.includes('image') || note.attachmentUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/notes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold break-words">{note.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-muted-foreground" title={dateInfo.absolute}>
                  Created {dateInfo.relative}
                </p>
                {note.attachmentKey && (
                  <Badge variant="outline">
                    <Paperclip className="w-3 h-3 mr-1" />
                    Attachment
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="outline" asChild>
                <Link to={`/notes/${note.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{note.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteNoteMutation.isPending}
                    >
                      {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-4">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {note.body}
          </div>
          
          {/* AI Summarize Button */}
          {note.body && note.body.length > 100 && (
            <div className="not-prose border-t pt-4">
              <SummarizeButton text={note.body} />
            </div>
          )}
        </div>

        {/* Attachment */}
        {note.attachmentUrl && (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Attachment</h3>
              <Button
                variant="outline"
                onClick={() => handleDownload(note.attachmentUrl!, note.attachmentKey)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            {isImage ? (
              <div className="space-y-4">
                <img
                  src={note.attachmentUrl}
                  alt="Note attachment"
                  className="max-w-full h-auto rounded-md shadow-md"
                  loading="lazy"
                />
                <p className="text-sm text-muted-foreground">
                  Click download to save the original file
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-md">
                <Paperclip className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{note.attachmentKey || 'Attachment'}</p>
                  <p className="text-sm text-muted-foreground">
                    Click download to view or save the file
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NoteDetail;