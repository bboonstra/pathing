"use client";

import { useState } from "react";
import { ClipboardIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface CopyButtonProps {
    text: string;
    className?: string;
    iconClassName?: string;
    showText?: boolean;
    successText?: string;
    defaultText?: string;
}

export default function CopyButton({
    text,
    className = "p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors",
    iconClassName = "h-5 w-5",
    showText = false,
    successText = "Copied!",
    defaultText = "Copy",
}: CopyButtonProps) {
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            className={className}
            onClick={copyToClipboard}
            aria-label={copied ? successText : defaultText}
        >
            {copied ? (
                <span className="flex items-center gap-1">
                    <CheckCircleIcon className={iconClassName} />
                    {showText && successText}
                </span>
            ) : (
                <span className="flex items-center gap-1">
                    <ClipboardIcon className={iconClassName} />
                    {showText && defaultText}
                </span>
            )}
        </button>
    );
}
