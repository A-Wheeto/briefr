import { auth } from "@/lib/auth"
import StandupButton from "./StandupButton"
import ThemeToggle from "./ThemeToggle"
import UserMenu from "./UserMenu"

export default async function Header() {
  const session = await auth()
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"

  return (
    <header className="h-13 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="16" rx="2" fill="#475569" fillOpacity="0.2"/>
          <rect x="2" y="2" width="7" height="7" rx="2" fill="#475569"/>
          <rect x="11" y="2" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.5"/>
          <rect x="11" y="8" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.3"/>
        </svg>
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Briefr</span>
      </div>

      <div className="flex-1" />

      <StandupButton />
      <ThemeToggle />
      <UserMenu
        name={session?.user?.name}
        email={session?.user?.email}
        initials={initials}
      />
    </header>
  )
}
