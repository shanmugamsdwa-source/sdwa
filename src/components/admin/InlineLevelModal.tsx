'use client';

import { useState } from 'react';
import { AchievementLevel, COLLECTIONS } from '@/types';
import { createDocument } from '@/lib/firebase/firestore';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLevelCreated: (level: AchievementLevel) => void;
}

export default function InlineLevelModal({ isOpen, onClose, onLevelCreated }: Props) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        displayOrder: 99,
        isActive: true,
      };

      const newId = await createDocument(COLLECTIONS.ACHIEVEMENT_LEVELS, payload);
      onLevelCreated({
        id: newId,
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        displayOrder: 99,
        isActive: true,
      });
      setName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 className="font-bold text-white text-base">New Achievement Level</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Level / Tier Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Commonwealth, Asian Games"
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Creating...' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
