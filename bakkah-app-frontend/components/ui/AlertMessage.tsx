'use client';

export default function AlertMessage({ type, message }: { type: 'error' | 'success', message: string }) {
    if (!message) return null;
    const isError = type === 'error';
    return (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold text-center border transform transition-all duration-500 translate-y-0 opacity-100 ${
            isError 
                ? 'bg-[#B03052]/10 text-[#B03052] border-[#B03052]/20 shadow-[0_4px_12px_rgba(176,48,82,0.1)]' 
                : 'bg-[#3A7C15]/10 text-[#3A7C15] border-[#3A7C15]/20 shadow-[0_4px_12px_rgba(58,124,21,0.1)]'
        }`}>
            {message}
        </div>
    );
}