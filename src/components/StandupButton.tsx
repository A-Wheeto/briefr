"use client"

import { useState } from "react"
import StandupModal from "./StandupModal"

export default function StandupButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 5l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 5.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M2.5 10l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Standup
      </button>
      {open && <StandupModal onClose={() => setOpen(false)} />}
    </>
  )
}
