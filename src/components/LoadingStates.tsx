import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const NoteCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
);

export const NotesListSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <NoteCardSkeleton key={i} />
    ))}
  </div>
);

export const NoteDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-10 w-20" />
    </div>
    <Skeleton className="h-4 w-1/4" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

export const FormSkeleton = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <Skeleton className="h-8 w-1/3" />
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);