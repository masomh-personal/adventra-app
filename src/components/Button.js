export default function Button({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) {
  const baseStyle =
    'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-md font-heading font-semibold transition-colors duration-200';

  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    red: 'bg-red-600 text-white hover:bg-secondary',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
    >
      {label}
    </button>
  );
}
