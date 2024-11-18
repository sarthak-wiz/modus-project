import HelloButton from '../app/component/HelloComponent';
import { auth } from "@clerk/nextjs/server";


export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {userId ? (
          <HelloButton />
        ) : (
          <p className="text-center">Please sign in to continue</p>
        )}
      </div>
    </main>
  );
}