
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'slate';
  size?: 'xs' | 'sm';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  icon
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    amber: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    slate: "bg-slate-900 text-white border-slate-800"
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px] font-black tracking-tighter",
    sm: "px-2.5 py-1 text-[10px] font-bold tracking-tight"
  };

  return (
    <span className={`inline-flex items-center gap-1 border rounded-lg uppercase ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
