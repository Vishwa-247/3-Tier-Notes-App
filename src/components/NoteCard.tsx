import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Note } from '@/types/note';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Edit, Trash2, Paperclip } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{note.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(note.createdAt)}
            </p>
          </div>
          {note.attachmentKey && (
            <Badge variant="outline" className="ml-2 flex-shrink-0">
              <Paperclip className="w-3 h-3 mr-1" />
              File
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {truncateText(note.body)}
        </p>
        
        {note.attachmentUrl && note.attachmentKey?.includes('image') && (
          <div className="mb-4">
            <img
              src={note.attachmentUrl}
              alt="Note attachment"
              className="w-full h-32 object-cover rounded-md"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/notes/${note.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/notes/${note.id}/edit`}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};