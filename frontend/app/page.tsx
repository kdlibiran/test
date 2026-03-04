import { CounterClient } from "@/components/counter/counter-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Manual Counter
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Backend: <code className="font-mono">{BASE_URL}</code>
        </p>
        <CounterClient />
      </main>
    </div>
  );
}

