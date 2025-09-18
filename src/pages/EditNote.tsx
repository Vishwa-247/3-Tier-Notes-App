import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { FormSkeleton } from '@/components/LoadingStates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNote, useUpdateNote } from '@/hooks/useNotes';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: note, isLoading, error } = useNote(id!);
  const updateNoteMutation = useUpdateNote();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !id) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your note.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let attachmentKey = note?.attachmentKey;

      // Handle new file upload if file is selected
      if (selectedFile) {
        setIsUploading(true);
        
        try {
          // Get presigned URL
          const presignData = await apiClient.getPresignedUrl(id, {
            filename: selectedFile.name,
            contentType: selectedFile.type,
          });

          // Upload file
          await apiClient.uploadFile(
            presignData.uploadUrl,
            selectedFile,
            setUploadProgress
          );

          attachmentKey = presignData.key;
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          toast({
            title: 'File upload failed',
            description: 'The note will be updated but the new file could not be uploaded.',
            variant: 'destructive',
          });
        }
      }

      // Update note
      await updateNoteMutation.mutateAsync({
        id,
        data: {
          title: title.trim(),
          body: body.trim(),
          ...(attachmentKey !== note?.attachmentKey && { attachmentKey }),
        },
      });

      navigate(`/notes/${id}`);
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  if (isLoading) {
    return (
      <Layout>
        <FormSkeleton />
      </Layout>
    );
  }

  if (error || !note) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Note not found</h2>
          <p className="text-muted-foreground mb-4">
            The note you're trying to edit doesn't exist or has been deleted.
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

  const isSubmitting = updateNoteMutation.isPending || isUploading;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to={`/notes/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Note
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Edit Note</h1>
          <p className="text-muted-foreground mt-2">
            Update your note content and attachments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your note..."
              required
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your note content here..."
              disabled={isSubmitting}
              className="mt-1 min-h-[200px] resize-vertical"
            />
          </div>

          <div>
            <Label>Attachment</Label>
            <div className="mt-1 space-y-4">
              {note.attachmentUrl && !selectedFile && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-2">Current attachment:</p>
                  {note.attachmentKey?.includes('image') ? (
                    <img
                      src={note.attachmentUrl}
                      alt="Current attachment"
                      className="max-w-xs h-32 object-cover rounded"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {note.attachmentKey || 'File attachment'}
                    </p>
                  )}
                </div>
              )}
              
              <FileUpload
                onFileSelect={setSelectedFile}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
              />
              
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  This will replace your current attachment.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Note'}
            </Button>
            
            <Button variant="outline" asChild>
              <Link to={`/notes/${id}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditNote;