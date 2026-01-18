interface DividerWithTextProps {
    text?: string;
}

export default function DividerWithText({ text }: DividerWithTextProps): React.JSX.Element {
    return (
        <div className='mt-6 relative'>
            <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
            </div>

            <div className='relative flex justify-center text-sm'>
                {text ? (
                    <span className='px-2 bg-white text-gray-500'>{text}</span>
                ) : (
                    <span className='py-2' /> // Keeps height/spacing consistent
                )}
            </div>
        </div>
    );
}
