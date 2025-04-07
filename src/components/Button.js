import { ImSpinner9 } from 'react-icons/im';

export default function Button({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  isLoading = false,
  isValid = true,
  loadingLabel = 'Processing...',
  leftIcon = null,
  rightIcon = null,
  testId = 'button',
  role = 'button',
  as = 'button', // 'button' or 'a'
  href = '',
  ...rest
}) {
  const isButtonDisabled = disabled || isLoading || !isValid;

  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px]',
    base: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm',
  };

  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'bg-gray-100 text-primary hover:bg-gray-200 border border-transparent',
    subtle: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    tertiary: 'bg-tertiary text-white hover:bg-primary',
    link: 'bg-transparent text-primary underline hover:text-secondary p-0',
    muted: 'bg-[#e2e2e2] text-gray-700 hover:bg-[#d0d0d0]',
    clean: 'bg-white text-primary border border-gray-300 hover:bg-gray-100',
    inverse: 'bg-white text-primary hover:text-white hover:bg-primary border border-primary',
  };

  const baseStyle = `
    inline-flex items-center justify-center gap-2
    rounded-md font-heading font-semibold uppercase tracking-wide
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    shadow-sm hover:shadow-md active:shadow-inner
    border border-transparent
  `;

  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const invalidStyle = 'bg-gray-300 text-gray-500 hover:bg-gray-300';

  const combinedClassName = `
    ${baseStyle}
    ${sizeStyles[size] || sizeStyles.lg}
    ${variants[variant] || variants.primary}
    ${isButtonDisabled ? disabledStyle : ''}
    ${!isValid && !isLoading && !disabled ? invalidStyle : ''}
    ${className}
  `;

  const content = (
    <>
      {isLoading ? (
        <ImSpinner9
          data-testid="spinner"
          className={`animate-spin ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`}
        />
      ) : (
        leftIcon
      )}
      {isLoading ? loadingLabel : label}
      {!isLoading && rightIcon}
    </>
  );

  if (as === 'a') {
    return (
      <a
        href={href}
        className={combinedClassName}
        data-testid={testId}
        role={role}
        aria-disabled={isButtonDisabled}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      aria-disabled={isButtonDisabled}
      data-testid={testId}
      role={role}
      className={combinedClassName}
      {...rest}
    >
      {content}
    </button>
  );
}
