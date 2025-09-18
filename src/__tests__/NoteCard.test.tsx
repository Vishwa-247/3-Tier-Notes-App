import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { NoteCard } from '@/components/NoteCard';
import { Note } from '@/types/note';

const mockNote: Note = {
  id: '1',
  title: 'Test Note',
  body: 'This is a test note content that should be truncated if it is too long to display in the card.',
  createdAt: '2024-01-15T10:30:00Z',
  attachmentKey: 'test-file.pdf',
  attachmentUrl: 'https://example.com/file.pdf',
};

const mockOnDelete = vi.fn();

const renderNoteCard = (note: Note = mockNote) => {
  return render(
    <BrowserRouter>
      <NoteCard note={note} onDelete={mockOnDelete} />
    </BrowserRouter>
  );
};

describe('NoteCard', () => {
  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it('renders note information correctly', () => {
    renderNoteCard();
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText(/This is a test note content/)).toBeInTheDocument();
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it('shows attachment badge when note has attachment', () => {
    renderNoteCard();
    
    expect(screen.getByText('File')).toBeInTheDocument();
  });

  it('does not show attachment badge when note has no attachment', () => {
    const noteWithoutAttachment = {
      ...mockNote,
      attachmentKey: undefined,
      attachmentUrl: undefined,
    };
    
    renderNoteCard(noteWithoutAttachment);
    
    expect(screen.queryByText('File')).not.toBeInTheDocument();
  });

  it('truncates long content', () => {
    const longContent = 'A'.repeat(200);
    const noteWithLongContent = {
      ...mockNote,
      body: longContent,
    };
    
    renderNoteCard(noteWithLongContent);
    
    const truncatedText = screen.getByText(/A+\.\.\./);
    expect(truncatedText).toBeInTheDocument();
    expect(truncatedText.textContent?.length).toBeLessThan(longContent.length);
  });

  it('displays image preview for image attachments', () => {
    const imageNote = {
      ...mockNote,
      attachmentKey: 'image.jpg',
      attachmentUrl: 'https://example.com/image.jpg',
    };
    
    renderNoteCard(imageNote);
    
    const image = screen.getByAltText('Note attachment');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('has correct navigation links', () => {
    renderNoteCard();
    
    const viewLink = screen.getByRole('link', { name: /view/i });
    const editLink = screen.getByRole('link', { name: /edit/i });
    
    expect(viewLink).toHaveAttribute('href', '/notes/1');
    expect(editLink).toHaveAttribute('href', '/notes/1/edit');
  });

  it('calls onDelete when delete button is clicked', () => {
    renderNoteCard();
    
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('handles invalid date gracefully', () => {
    const noteWithInvalidDate = {
      ...mockNote,
      createdAt: 'invalid-date',
    };
    
    renderNoteCard(noteWithInvalidDate);
    
    expect(screen.getByText('Unknown date')).toBeInTheDocument();
  });
});