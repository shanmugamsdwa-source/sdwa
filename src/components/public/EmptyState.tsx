import React from 'react';
import Link from 'next/link';
import { Award, Trophy, Building2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'achievements' | 'tournaments' | 'institutions' | 'gallery' | 'generic';
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  type = 'generic',
  title,
  message,
  actionText,
  actionHref,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'achievements':
        return <Award className="w-12 h-12 text-amber-600" />;
      case 'tournaments':
        return <Trophy className="w-12 h-12 text-amber-600" />;
      case 'institutions':
        return <Building2 className="w-12 h-12 text-amber-600" />;
      case 'gallery':
        return <ImageIcon className="w-12 h-12 text-amber-600" />;
      default:
        return <AlertCircle className="w-12 h-12 text-amber-600" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'achievements':
        return 'No Achievements Found';
      case 'tournaments':
        return 'No Tournaments Available';
      case 'institutions':
        return 'No Institutions Found';
      case 'gallery':
        return 'No Albums Available';
      default:
        return 'No Records Available';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'achievements':
        return 'No achievements matching your active filters have been recorded yet.';
      case 'tournaments':
        return 'There are currently no championships scheduled in this category.';
      case 'institutions':
        return 'No affiliated institutions match the selected classification.';
      case 'gallery':
        return 'Photo albums and ceremony archives will be published shortly.';
      default:
        return 'Please check back soon or adjust your search criteria.';
    }
  };

  return (
    <div className="w-full py-16 px-6 bg-slate-50 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center my-8">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
        {title || getDefaultTitle()}
      </h3>
      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        {message || getDefaultMessage()}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-md transition shadow-sm hover:shadow"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
