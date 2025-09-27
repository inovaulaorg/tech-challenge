import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium rounded-lg',
      'border border-transparent',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-all duration-200 ease-in-out',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      'relative',
      
      // Size variants
      size === 'xs' && 'px-2.5 py-1.5 text-xs',
      size === 'sm' && 'px-3 py-2 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-4 py-2 text-base',
      size === 'xl' && 'px-6 py-3 text-lg',
      
      // Color variants with hover/active states
      variant === 'primary' && [
        'bg-primary-600 text-white shadow-sm focus:ring-primary-500',
        !disabled && !isLoading && ['hover:bg-primary-700 hover:shadow-md', 'active:bg-primary-800'],
      ],
      variant === 'secondary' && [
        'bg-secondary-100 text-secondary-900 border-secondary-200 focus:ring-secondary-500',
        !disabled && !isLoading && ['hover:bg-secondary-200 hover:border-secondary-300', 'active:bg-secondary-300'],
      ],
      variant === 'outline' && [
        'bg-transparent text-primary-700 border-primary-300 focus:ring-primary-500',
        !disabled && !isLoading && ['hover:bg-primary-50 hover:border-primary-400', 'active:bg-primary-100'],
      ],
      variant === 'ghost' && [
        'bg-transparent text-secondary-700 focus:ring-secondary-500',
        !disabled && !isLoading && ['hover:bg-secondary-100 hover:text-secondary-900', 'active:bg-secondary-200'],
      ],
      variant === 'danger' && [
        'bg-error-600 text-white shadow-sm focus:ring-error-500',
        !disabled && !isLoading && ['hover:bg-error-700 hover:shadow-md', 'active:bg-error-800'],
      ],
      
      fullWidth && 'w-full',
      isLoading && 'cursor-wait',
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
        
        {/* Left icon */}
        {leftIcon && !isLoading && (
          <span className="mr-2 -ml-0.5 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Button content */}
        <span className={clsx(isLoading && 'invisible')}>
          {children}
        </span>
        
        {/* Right icon */}
        {rightIcon && !isLoading && (
          <span className="ml-2 -mr-0.5 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
