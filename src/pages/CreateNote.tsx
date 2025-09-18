import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateNote } from '@/hooks/useNotes';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();
  const createNoteMutation = useCreateNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your note.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let attachmentKey = undefined;

      // Handle file upload if file is selected
      if (selectedFile) {
        setIsUploading(true);
        
        // First create the note to get an ID
        const tempNote = await createNoteMutation.mutateAsync({
          title: title.trim(),
          body: body.trim(),
        });

        try {
          // Get presigned URL
          const presignData = await apiClient.getPresignedUrl(tempNote.id, {
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

          // Update note with attachment key
          await apiClient.updateNote(tempNote.id, {
            title: title.trim(),
            body: body.trim(),
            attachmentKey,
          });

        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          toast({
            title: 'File upload failed',
            description: 'The note was created but the file could not be uploaded.',
            variant: 'destructive',
          });
        }

        navigate(`/notes/${tempNote.id}`);
      } else {
        // Create note without file
        const note = await createNoteMutation.mutateAsync({
          title: title.trim(),
          body: body.trim(),
        });
        navigate(`/notes/${note.id}`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const isSubmitting = createNoteMutation.isPending || isUploading;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
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
        <div>
          <h1 className="text-3xl font-bold">Create New Note</h1>
          <p className="text-muted-foreground mt-2">
            Write your thoughts and attach files to remember them forever.
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
            <Label>Attachment (optional)</Label>
            <div className="mt-1">
              <FileUpload
                onFileSelect={setSelectedFile}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Note'}
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/notes">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateNote;