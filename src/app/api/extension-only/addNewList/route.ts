// ENDPOINT: /api/extension-only/addNewList (POST)

import { addNewList } from "@/app/actions";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ message: "Name is required" }), {
        status: 400,
      });
    }

    const formData = new FormData();
    formData.append("newListName", name);
    const res = await addNewList({}, formData);

    return new Response(
      JSON.stringify({
        res,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        message: "Failed to add list",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
