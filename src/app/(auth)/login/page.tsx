import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="16" rx="2" fill="#475569" fillOpacity="0.2"/>
              <rect x="2" y="2" width="7" height="7" rx="2" fill="#475569"/>
              <rect x="11" y="2" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.5"/>
              <rect x="11" y="8" width="7" height="4" rx="2" fill="#475569" fillOpacity="0.3"/>
            </svg>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Briefr</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your daily work, summarised.</p>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Sign in</h1>
        <form action={async () => { "use server"; await signIn("github", { redirectTo: "/" }); }}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
