'use client';

import { useState, useEffect, useCallback } from 'react';
import { AssociationSettings } from '@/types';
import { getAssociationSettings, updateAssociationSettings } from '@/lib/firebase/firestore';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<AssociationSettings>({
    name: 'Salem District Weightlifting Association',
    shortName: 'SDWA',
    registrationNumber: '112 / 2020',
    affiliation: {
      organizationName: 'Tamil Nadu State Weightlifting Association',
      relationship: 'Affiliated to',
    },
    address: 'Shiv, Shaktinagar, Salem, Tamil Nadu 636201',
    phone: '09944301212',
    email: 'shanmugamsdwa@gmail.com',
    logoUrl: '/images/sdwa-logo.png',
    faviconUrl: '',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.9050662374866!2d78.13689007010963!3d11.630114717643819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babefd6fceb62a3%3A0xf3581da1e2038658!2sISHA%20GYM%20Weightlifting%20sports%20academy!5e0!3m2!1sen!2sin!4v1786905574773!5m2!1sen!2sin',
    description: '',
    mission: '',
    vision: '',
    socialLinks: {
      instagram: 'https://www.instagram.com/isha_gym_shanmugam?igsh=MnlneHF1ZG9wb2Ny',
      facebook: 'https://www.facebook.com/share/14kUMAKhV4x',
      youtube: 'https://youtube.com/@ishagym_salem_tn?si=gxU5QBkCYOTBjxYb',
    },
    workingHours: [
      { day: 'Saturday', open: '06:00', close: '22:00', note: 'Hours might differ' },
      { day: 'Sunday', open: '06:30', close: '10:00' },
    ],
  });

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAssociationSettings();
      if (data) setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      await updateAssociationSettings(settings);
      setMessage({ type: 'success', text: 'Association settings saved successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error saving settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const addWorkingHour = () => {
    setSettings({
      ...settings,
      workingHours: [...(settings.workingHours || []), { day: 'Monday', open: '06:00', close: '20:00' }],
    });
  };

  const removeWorkingHour = (index: number) => {
    const updated = [...(settings.workingHours || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, workingHours: updated });
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Association Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure general organization details, affiliations, branding logos, contact info, and working hours.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding & Logo */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Branding &amp; Official Emblems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Primary Association Crest / Logo"
              value={settings.logoUrl || ''}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              folder="sdwa/branding"
              aspectRatio="square"
            />
            <ImageUploader
              label="Favicon / Icon Symbol"
              value={settings.faviconUrl || ''}
              onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
              folder="sdwa/branding"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Core Identity */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Core Identity &amp; Affiliation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Full Association Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Short Name / Acronym
              </label>
              <input
                type="text"
                value={settings.shortName}
                onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                value={settings.registrationNumber}
                onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Affiliated Parent Organization
              </label>
              <input
                type="text"
                value={settings.affiliation?.organizationName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    affiliation: {
                      ...settings.affiliation,
                      organizationName: e.target.value,
                      relationship: 'Affiliated to',
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Contact &amp; Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Office Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Google Maps Embed URL
              </label>
              <input
                type="url"
                value={settings.googleMapsEmbedUrl || ''}
                onChange={(e) => setSettings({ ...settings, googleMapsEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Working Hours</h2>
            <button
              type="button"
              onClick={addWorkingHour}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 rounded-lg"
            >
              <Plus size={14} /> Add Slot
            </button>
          </div>
          <div className="space-y-3">
            {settings.workingHours?.map((wh, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#0F172A] p-3 rounded-lg border border-slate-700">
                <input
                  type="text"
                  placeholder="Day (e.g. Saturday)"
                  value={wh.day}
                  onChange={(e) => {
                    const updated = [...(settings.workingHours || [])];
                    updated[idx].day = e.target.value;
                    setSettings({ ...settings, workingHours: updated });
                  }}
                  className="px-2.5 py-1.5 bg-[#1E293B] border border-slate-600 rounded text-xs text-white flex-1"
                />
                <input
                  type="text"
                  placeholder="Open (e.g. 06:00)"
                  value={wh.open}
                  onChange={(e) => {
                    const updated = [...(settings.workingHours || [])];
                    updated[idx].open = e.target.value;
                    setSettings({ ...settings, workingHours: updated });
                  }}
                  className="px-2.5 py-1.5 bg-[#1E293B] border border-slate-600 rounded text-xs text-white w-24"
                />
                <input
                  type="text"
                  placeholder="Close (e.g. 22:00)"
                  value={wh.close}
                  onChange={(e) => {
                    const updated = [...(settings.workingHours || [])];
                    updated[idx].close = e.target.value;
                    setSettings({ ...settings, workingHours: updated });
                  }}
                  className="px-2.5 py-1.5 bg-[#1E293B] border border-slate-600 rounded text-xs text-white w-24"
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={wh.note || ''}
                  onChange={(e) => {
                    const updated = [...(settings.workingHours || [])];
                    updated[idx].note = e.target.value;
                    setSettings({ ...settings, workingHours: updated });
                  }}
                  className="px-2.5 py-1.5 bg-[#1E293B] border border-slate-600 rounded text-xs text-white flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeWorkingHour(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
