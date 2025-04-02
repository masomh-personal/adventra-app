import { FaSpinner } from 'react-icons/fa';

export default function Button({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  isLoading = false,
  loadingLabel = 'Loading...',
  leftIcon = null,
  rightIcon = null,
}) {
  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    base: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-primary hover:bg-gray-100 border border-transparent',
    subtle: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const baseStyle =
    'inline-flex items-center justify-center gap-2 rounded-md font-heading font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyle}
        ${sizeStyles[size] || sizeStyles.lg}
        ${variants[variant] || variants.primary}
        ${disabled || isLoading ? disabledStyle : ''}
        ${className}
      `}
    >
      {/* Left Icon */}
      {isLoading ? <FaSpinner className="animate-spin h-4 w-4" /> : leftIcon}

      {/* Button Label */}
      {isLoading ? loadingLabel : label}

      {/* Right Icon */}
      {!isLoading && rightIcon}
    </button>
  );
}
