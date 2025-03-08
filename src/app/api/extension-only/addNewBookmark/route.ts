import { addNewBookmark } from "@/app/actions";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const { url, listId, title } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ message: "URL is required" }), {
        status: 400,
      });
    }

    if (!listId) {
      return new Response(JSON.stringify({ message: "List ID is required" }), {
        status: 400,
      });
    }

    const formData = new FormData();
    formData.append("link", url);
    formData.append("listId", listId);
    formData.append("title", title);
    const res = await addNewBookmark({}, formData);

    return new Response(
      JSON.stringify({
        res,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        message: "Failed to add bookmark",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
