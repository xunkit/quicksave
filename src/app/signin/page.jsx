import { auth, signIn, signOut } from "@/auth";

export default async function SignIn({ searchParams }) {
  const session = await auth();
  const callbackUrl = searchParams?.callbackUrl || "/app";

  if (session?.user)
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <p>{JSON.stringify(session?.user)}</p>
        <button type="submit">Sign out</button>
      </form>
    );

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: callbackUrl });
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
