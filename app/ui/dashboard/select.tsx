'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { clsx } from 'clsx';

export default function Select({
    placeholder,
    users
}: {
    placeholder: string;
    users: { id: string; name: string; email: string; }[]
}): React.JSX.Element {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // חילוץ המשתמש הנוכחי מה-URL כדי להציג אותו כתג
    const currentUserId = searchParams.get('userId');
    const selectedUser = users.find(u => u.id === currentUserId);

    // סגירת התפריט בלחיצה מחוץ לרכיב
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (userId: string) => {
        const params = new URLSearchParams(searchParams);
        if (userId && userId !== currentUserId) {
            params.set('userId', userId);
        } else {
            params.delete('userId');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
        setIsOpen(false); // סגירה לאחר בחירה
    };

    const removeSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        const params = new URLSearchParams(searchParams);
        params.delete('userId');
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative w-full max-w-[250px]" ref={containerRef}>
            {/* Input Field / Trigger */}
            <div
                className={clsx(
                    "flex items-center justify-between gap-2 p-2 border rounded-lg bg-white cursor-pointer min-h-[42px] transition-all hover:border-gray-300",
                    isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1.5 flex-1 items-center overflow-hidden">
                    {selectedUser ? (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                            {selectedUser.name}
                            <X
                                size={14}
                                className="cursor-pointer hover:text-red-500 transition-colors"
                                onClick={removeSelection}
                            />
                        </span>
                    ) : (
                        <span className="text-sm text-gray-400 font-medium px-1">
                            {placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown size={18} className={clsx("text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-64 overflow-auto py-1 animate-in fade-in zoom-in duration-150">
                    <div 
                        className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 mb-1"
                    >
                        Select User
                    </div>
                    
                    {/* אופציה לביטול בחירה */}
                    <div
                        className={clsx(
                            "px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50",
                            !currentUserId && "bg-blue-50/50 text-blue-700 font-semibold"
                        )}
                        onClick={() => handleSelect("")}
                    >
                        All Users
                    </div>

                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={clsx(
                                "px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 border-l-2",
                                currentUserId === user.id ? "bg-blue-50 border-blue-500 font-semibold text-blue-700" : "border-transparent"
                            )}
                            onClick={() => handleSelect(user.id)}
                        >
                            <div className="flex flex-col">
                                <span className="text-gray-900">{user.name}</span>
                                <span className="text-[11px] text-gray-500 font-normal">{user.email}</span>
                            </div>
                        </div>
                    ))}

                    {users.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">
                            No users found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}