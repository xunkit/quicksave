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
