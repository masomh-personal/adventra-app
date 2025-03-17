export default function Button({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
}) {
  const baseStyle =
    'px-4 py-2 rounded-md font-heading font-semibold transition-colors duration-200';

  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
