import React from "react";

const PremiumLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                aria-label="Loading..."
                role="status"
                className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white px-8 py-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
                <div className="relative">
                    <svg
                        className="h-12 w-12 animate-spin stroke-zinc-600 dark:stroke-zinc-300"
                        viewBox="0 0 256 256"
                    >
                        <line
                            x1={128}
                            y1={32}
                            x2={128}
                            y2={64}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1="195.9"
                            y1="60.1"
                            x2="173.3"
                            y2="82.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1={224}
                            y1={128}
                            x2={192}
                            y2={128}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1="195.9"
                            y1="195.9"
                            x2="173.3"
                            y2="173.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1={128}
                            y1={224}
                            x2={128}
                            y2={192}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1="60.1"
                            y1="195.9"
                            x2="82.7"
                            y2="173.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1={32}
                            y1={128}
                            x2={64}
                            y2={128}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                        <line
                            x1="60.1"
                            y1="60.1"
                            x2="82.7"
                            y2="82.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={24}
                        />
                    </svg>
                </div>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Loading...
                </span>
            </div>
        </div>
    );
};

export default PremiumLoader;
