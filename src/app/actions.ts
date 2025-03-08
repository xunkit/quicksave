/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import {
  // ADD NEW LIST
  maxCharacterCountOfListName,
  minCharacterCountOfBookmarkLink,
  // ADD NEW BOOKMARK
  minCharacterCountOfListName,
} from "@/constants";
import fetchFromAPI from "@/lib/fetchFromBackendAPI";
import fetchPageAndReturnPageInfo from "@/lib/fetchPageAndReturnPageInfo";
import { getParentSite } from "@/lib/utils";

import { ActionState } from "@/types";
import { z } from "zod";

// zodValidate: Validate data Helper class
// How to use: zodValidate(VALIDATION_SCHEMA, VALIDATION_FIELDS)
// Example: zodValidate(UserSignUpSchema, {username: formData.get('username'), password: formData.get('password')})
const zodValidate = (
  zodSchema: z.ZodObject<z.ZodRawShape>,
  fieldsToValidate: object
): ActionState | void => {
  const validatedFields = zodSchema.safeParse(fieldsToValidate);

  if (!validatedFields.success) {
    throw {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors.newListName || [],
    };
  }
};

// ACTIONS ARE BELOW

// GET LISTS BY USER ---------------------------

export const getListsByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Invalid Session");
  }

  try {
    const res = await fetchFromAPI("/lists/user/" + session.user.id);
    return res.json();
  } catch (error) {
    throw error;
  }
};

// --------------------------- GET LIST BY USER

// GET BOOKMARKS BY LISTID ---------------------------

export const getBookmarksByListId = async (listId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Invalid Session");
  }

  try {
    const res = await fetchFromAPI("/lists/" + listId);
    const { bookmarks } = await res.json();
    return bookmarks;
  } catch (error) {
    throw error;
  }
};

// --------------------------- GET BOOKMARKS BY LISTID

// ADD NEW LIST -----------------------------

const addNewListSchema = z.object({
  newListName: z
    .string({
      invalid_type_error: "Invalid List Name",
    })
    .min(minCharacterCountOfListName)
    .max(maxCharacterCountOfListName),
});

export async function addNewList(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    zodValidate(addNewListSchema, { newListName: formData.get("newListName") });
    await fetchFromAPI("/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("newListName"),
        userId: session.user.id,
      }),
    });
    return { success: true };
  } catch (error: any) {
    // To check if the error is not caused by Zod validation (because Zod will return an action state with "SUCCESS" in it)
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- ADD NEW LIST

// ADD NEW BOOKMARK -----------------------------

const addNewBookmarkSchema = z.object({
  link: z
    .string({
      invalid_type_error: "Invalid Link",
    })
    .min(minCharacterCountOfBookmarkLink),
});

export async function addNewBookmark(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    zodValidate(addNewBookmarkSchema, { link: formData.get("link") });
    const { title: generatedTitle, ogImage: generatedImg } =
      await fetchPageAndReturnPageInfo(formData.get("link") as string);

    await fetchFromAPI("/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formData.get("link"),
        userId: session.user.id,
        listId: formData.get("listId"),
        title: formData.get("title") ? formData.get("title") : generatedTitle,
        description: formData.get("description")
          ? formData.get("description")
          : null,
        parentSite: getParentSite(formData.get("link") as string),
        imageSrc: generatedImg,
      }),
    });
    return {
      success: true,
      data: {
        url: formData.get("link"),
        userId: session.user.id,
        listId: formData.get("listId"),
        title: formData.get("title") ? formData.get("title") : generatedTitle,
        description: formData.get("description")
          ? formData.get("description")
          : null,
        parentSite: getParentSite(formData.get("link") as string),
        imageSrc: generatedImg,
      },
    };
  } catch (error: any) {
    // To check if the error is not caused by Zod validation (because Zod will return an action state with "SUCCESS" in it)
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- ADD NEW BOOKMARK

// CHANGE LIST NAME -----------------------------

const changeListNameSchema = z.object({
  newListName: z
    .string({
      invalid_type_error: "Invalid List Name",
    })
    .min(minCharacterCountOfListName)
    .max(maxCharacterCountOfListName),
});

export async function changeListName(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    const listId = formData.get("listId");
    const newListName = formData.get("newListName");

    if (!listId || typeof listId !== "string") {
      throw new Error("Invalid List ID");
    }

    zodValidate(changeListNameSchema, { newListName });

    await fetchFromAPI(`/lists/${listId}/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newListName }),
    });

    return { success: true };
  } catch (error: any) {
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- CHANGE LIST NAME

// EDIT BOOKMARK
const editBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export async function editBookmark(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    const bookmarkId = formData.get("bookmarkId");
    if (!bookmarkId || typeof bookmarkId !== "string") {
      throw new Error("Invalid Bookmark ID");
    }

    // Validate title and description
    zodValidate(editBookmarkSchema, {
      title: formData.get("title"),
      description: formData.get("description"),
    });

    // Ensure fields have valid values
    const title =
      formData.get("title") && formData.get("title") !== ""
        ? formData.get("title")
        : undefined; // Don't send if empty

    const description =
      formData.get("description") && formData.get("description") !== ""
        ? formData.get("description")
        : "";

    // Send API request to update the bookmark
    await fetchFromAPI(`/bookmarks/${bookmarkId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title || "(Untitled)", // Avoids sending empty values
        description: description, // Ensures empty description is saved as null
      }),
    });

    return { success: true };
  } catch (error: any) {
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- EDIT BOOKMARK

// DELETE BOOKMARK -----------------------------

export async function deleteBookmark(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    await fetchFromAPI(`/bookmarks/${formData.get("bookmarkId")}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error: any) {
    // To check if the error is not caused by Zod validation (because Zod will return an action state with "SUCCESS" in it)
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- DELETE BOOKMARK

// DELETE LIST -----------------------------

export async function deleteList(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Invalid Session");
    }

    await fetchFromAPI(`/lists/${formData.get("listId")}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error: any) {
    // To check if the error is not caused by Zod validation (because Zod will return an action state with "SUCCESS" in it)
    if (!("success" in error)) {
      console.error(error);
      return { success: false, errors: ["An unexpected error occurred"] };
    }
    return error;
  }
}

// ----------------------------- DELETE LIST
