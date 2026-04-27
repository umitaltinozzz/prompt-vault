'use client';

import { useState, useCallback } from 'react';
import { Prompt, MediaItem } from '@/types';
import { usePrompts } from '@/hooks/usePrompts';
import { copyToClipboard } from '@/lib/utils';
import {
  Header,
  SearchBar,
  PromptGrid,
  Toast,
  useToast,
  AddPromptModal,
  DetailModal,
  EditModal,
} from '@/components';

export default function Home() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Hooks
  const { prompts, isLoading, createPrompt, updatePrompt, deletePrompt } = usePrompts();
  const { toast, showToast } = useToast();

  // Handlers
  const handleAddPrompt = useCallback(
    async (data: {
      tweetUrl?: string;
      tweetId?: string;
      promptText: string;
      tags: string[];
      author?: string;
      authorHandle?: string;
      mediaItems?: MediaItem[];
    }) => {
      try {
        await createPrompt({
          tweetUrl: data.tweetUrl,
          tweetId: data.tweetId,
          promptText: data.promptText,
          tags: data.tags,
          author: data.author,
          authorHandle: data.authorHandle,
          mediaItems: data.mediaItems,
        });
        showToast('Prompt kaydedildi! 🎉', 'success');
      } catch (e) {
        showToast((e as Error).message || 'Kayıt hatası', 'error');
        throw e;
      }
    },
    [createPrompt, showToast]
  );

  const handleUpdatePrompt = useCallback(
    async (id: string, promptText: string, tags: string[]) => {
      try {
        await updatePrompt(id, { promptText, tags });
        showToast('Prompt güncellendi!', 'success');
      } catch (e) {
        showToast((e as Error).message || 'Güncelleme hatası', 'error');
        throw e;
      }
    },
    [updatePrompt, showToast]
  );

  const handleDeletePrompt = useCallback(
    async (id: string) => {
      if (!confirm('Bu promptu silmek istediğinize emin misiniz?')) return;

      try {
        await deletePrompt(id);
        showToast('Prompt silindi', 'success');
      } catch (e) {
        showToast((e as Error).message || 'Silme hatası', 'error');
      }
    },
    [deletePrompt, showToast]
  );

  const handleCopyPrompt = useCallback(
    async (text: string) => {
      const success = await copyToClipboard(text);
      showToast(success ? 'Kopyalandı! 📋' : 'Kopyalama hatası', success ? 'success' : 'error');
    },
    [showToast]
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <Header
        promptCount={prompts.length}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Search */}
      {prompts.length > 0 && (
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      )}

      {/* Prompt Grid */}
      <PromptGrid
        prompts={prompts}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onView={setViewingPrompt}
        onEdit={setEditingPrompt}
        onDelete={handleDeletePrompt}
        onCopy={handleCopyPrompt}
      />

      {/* Add Modal */}
      <AddPromptModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPrompt}
        existingTweetIds={prompts.map((p) => p.tweetId).filter(Boolean) as string[]}
      />

      {/* Detail Modal */}
      <DetailModal
        prompt={viewingPrompt}
        onClose={() => setViewingPrompt(null)}
        onEdit={(p) => {
          setViewingPrompt(null);
          setEditingPrompt(p);
        }}
        onCopy={() => showToast('Kopyalandı! 📋', 'success')}
      />

      {/* Edit Modal */}
      <EditModal
        prompt={editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onSave={handleUpdatePrompt}
      />

      {/* Toast */}
      <Toast toast={toast} />
    </main>
  );
}
