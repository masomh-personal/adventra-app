import { ImSpinner9 } from 'react-icons/im';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center w-full h-full py-24">
      <div
        className="bg-slate-50 border border-gray-200 bg-gradient-to-br from-slate-50 to-slate-100
        rounded-xl shadow-md px-6 py-8 flex flex-col items-center gap-y-6 max-w-md w-full"
      >
        <ImSpinner9
          className="animate-spin text-primary w-16 h-16 drop-shadow-sm"
          aria-hidden="true"
          data-testid="loading-icon"
        />
        <p className="text-base md:text-lg font-medium text-gray-700 tracking-wide uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
