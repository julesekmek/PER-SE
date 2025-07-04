import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-blue-900 hover:bg-blue-800 text-white border-transparent focus:ring-blue-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent focus:ring-yellow-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-500',
  disabled: 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || isLoading || variant === 'disabled'}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
} 