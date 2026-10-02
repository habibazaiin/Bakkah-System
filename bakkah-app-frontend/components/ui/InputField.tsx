'use client';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export default function InputField({ error, className, ...props }: InputFieldProps) {
    return (
        <div className="w-full relative">
            <input
                {...props}
                className={`w-full px-5 py-3.5 bg-[#F8FAFC] border-2 ${
                    error
                        ? 'border-[#B03052]/40 focus:border-[#B03052] focus:ring-[#B03052]/10'
                        : 'border-transparent focus:border-[#1E5A7A]/30 focus:ring-[#1E5A7A]/10'
                } rounded-xl text-[#1F2937] placeholder-[#94A3B8] font-medium focus:bg-white focus:outline-none focus:ring-4 transition-all duration-300 ${className || ''}`}
            />
            {error && (
                <p className="text-[#B03052] text-xs font-semibold mt-1.5 ml-1">
                    {error}
                </p>
            )}
        </div>
    );
}