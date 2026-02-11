
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'flat' | 'glass' | 'premium';
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, variant = 'default' }) => {
  const variants = {
    default: "bg-white shadow-sm border border-slate-200 rounded-2xl",
    flat: "bg-slate-50 border border-slate-200 rounded-2xl",
    glass: "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl",
    premium: "bg-gradient-to-br from-white to-indigo-50/30 shadow-md border border-indigo-100 rounded-2xl"
  };

  return (
    <div className={`${variants[variant]} overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
      {title && (
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
