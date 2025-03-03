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

// GET LIST BY USER ---------------------------

export const getListByUser = async () => {
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
    zodValidate(addNewListSchema, { newListName: formData.get("newListName") });
    const data = await fetch(
      "http://localhost:8080/lists/a78daef6-1df6-48b3-a264-59d828b37d52",
      { method: "GET" }
    );
    const text = await data.text();
    return { success: false, errors: [text] };
  } catch (error: any) {
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
    zodValidate(addNewBookmarkSchema, { link: formData.get("link") });
    const data = await fetch(`http://localhost:8080/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("link"),
        userId: "kiet",
      }),
    });
    const text = await data.text();
    return { success: false, errors: [text] };
  } catch (error: any) {
    return error;
  }
}

// ----------------------------- ADD NEW BOOKMARK
