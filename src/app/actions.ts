/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  // ADD NEW LIST
  maxCharacterCountOfListName,
  minCharacterCountOfListName,
  //
} from "@/constants";
import { ActionState } from "@/types";
import { z } from "zod";

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
  const validatedFields = addNewListSchema.safeParse({
    newListName: formData.get("newListName"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors.newListName || [],
    };
  }

  return { success: true, message: "Good" };

  // Mutate data
}

// ----------------------------- ADD NEW LIST
