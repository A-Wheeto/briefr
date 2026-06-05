"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

type Props = {
  name: string | null | undefined;
  email: string | null | undefined;
  initials: string;
};

export default function UserMenu({ name, email, initials }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            {name && <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>}
            {email && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{email}</p>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
