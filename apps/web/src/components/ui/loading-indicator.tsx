import React from 'react';

/**
 * LoadingIndicator Component
 *
 * A simple, reusable loading indicator using Tailwind CSS for styling.
 * It displays a spinning circle animation.
 *
 * Props:
 * - className (string, optional): Additional CSS classes to apply to the container div.
 * - size (string, optional): Tailwind width/height class (e.g., 'w-8 h-8', 'w-12 h-12'). Defaults to 'w-8 h-8'.
 * - color (string, optional): Tailwind border color class for the spinner (e.g., 'border-blue-500'). Defaults to 'border-blue-500'.
 * - text (string, optional): Optional text to display below the spinner (e.g., "Loading...").
 * - textClassName (string, optional): Additional CSS classes for the text element.
 */
const LoadingIndicator = ({
  className = '',
  size = 'w-8 h-8', // Default size
  thickness = 'border-4', // Default thickness
  color = 'border-blue-500', // Default color
  text = '',
  textClassName = 'mt-2 text-sm text-gray-600', // Default text style
}) => {
  // Combine default and provided classes
  const containerClasses = `flex flex-col items-center justify-center ${className}`;
  const spinnerClasses = `animate-spin rounded-full ${thickness} border-t-transparent ${size} ${color}`;
  const textClasses = `${textClassName}`;

  return (
    <div className={containerClasses}>
      {/* The spinning element */}
      <div className={spinnerClasses} role="status" aria-label="Loading">
        {/* Screen reader accessible text */}
        <span className="sr-only">Loading...</span>
      </div>
      {/* Optional text below the spinner */}
      {text && <p className={textClasses}>{text}</p>}
    </div>
  );
};

export default LoadingIndicator;
