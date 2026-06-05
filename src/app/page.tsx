import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Board from "@/components/Board";
import Header from "@/components/Header";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <Board />
      </main>
    </div>
  );
}
