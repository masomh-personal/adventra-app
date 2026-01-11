import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdCheckCircle, MdWarning, MdError } from 'react-icons/md';

type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error';

interface InfoBoxVariantConfig {
    icon: React.JSX.Element;
    bg: string;
    border: string;
    text: string;
}

const variants: Record<InfoBoxVariant, InfoBoxVariantConfig> = {
    info: {
        icon: <AiOutlineInfoCircle className="text-blue-500 w-5 h-5 mt-[2px] flex-shrink-0" />,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
    },
    success: {
        icon: <MdCheckCircle className="text-green-500 w-5 h-5 mt-[2px] flex-shrink-0" />,
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
    },
    warning: {
        icon: <MdWarning className="text-yellow-500 w-5 h-5 mt-[2px] flex-shrink-0" />,
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
    },
    error: {
        icon: <MdError className="text-red-500 w-5 h-5 mt-[2px] flex-shrink-0" />,
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
    },
};

interface InfoBoxProps {
    message: string | React.ReactNode;
    variant?: InfoBoxVariant;
    className?: string;
    role?: string;
    testId?: string;
}

export default function InfoBox({
    message,
    variant = 'info',
    className = '',
    role = 'status',
    testId = 'info-box',
}: InfoBoxProps): React.JSX.Element {
    const selected = variants[variant] || variants.info;

    return (
        <div className={`mt-4 flex justify-center ${className}`}>
            <div
                role={role}
                data-testid={testId}
                className={`flex items-start gap-2 max-w-md px-4 py-2 rounded-md border text-sm
          ${selected.bg} ${selected.border} ${selected.text}`}
            >
                {selected.icon}
                <span>{message}</span>
            </div>
        </div>
    );
}
