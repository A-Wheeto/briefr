import { auth, signOut } from "@/lib/auth";

export default async function Header() {
  const session = await auth();
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <header className="h-13 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="16" rx="2" fill="#475569" fillOpacity="0.2"/>
          <rect x="2" y="2" width="7" height="7" rx="2" fill="#475569"/>
          <rect x="11" y="2" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.5"/>
          <rect x="11" y="8" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.3"/>
        </svg>
        <span className="font-semibold text-gray-900 text-sm">Briefr</span>
      </div>

      <div className="flex-1" />

      <button className="bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
        ☀️ Standup
      </button>

      <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
        <button
          type="submit"
          title={session?.user?.name ?? ""}
          className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
        >
          {initials}
        </button>
      </form>
    </header>
  );
}
