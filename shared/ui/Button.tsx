
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden shrink-0";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200 shadow-sm",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400 shadow-sm",
    outline: "border border-slate-200 bg-transparent text-slate-600 hover:border-indigo-200 hover:text-indigo-600 focus:ring-indigo-500",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-100",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white"
  };

  const sizes = {
    sm: "h-8 px-3 text-[10px] uppercase tracking-wider rounded-lg",
    md: "h-10 px-5 text-sm rounded-xl",
    lg: "h-12 px-8 text-base rounded-xl",
    xl: "h-14 px-10 text-lg font-black rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={`${loading ? 'opacity-0' : 'flex items-center gap-2'}`}>
        {children}
      </span>
    </button>
  );
};
