"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { deleteBookmark } from "@/app/actions";
import { ActionState } from "@/types";
import { mutate } from "swr";
import { useLists } from "@/hooks/useLists";

const initialState: ActionState = {
  success: false,
  message: "",
  errors: [],
};

interface DeleteBookmarkDialogProps {
  bookmarkId: string;
  currentListId: string;
  children: React.ReactNode;
}

function DeleteBookmarkDialog({
  bookmarkId,
  currentListId,
  children,
}: DeleteBookmarkDialogProps) {
  const { refreshLists } = useLists();

  const [open, setOpen] = React.useState<boolean>(false);
  const [state, action, pending] = React.useActionState(
    deleteBookmark,
    initialState
  );
  const [errors, setErrors] = React.useState<Array<string>>([]);

  // Every time the form is submitted, this is triggered.
  // What it does:
  // - Check if the submission was OK, if OK -> close the form and erase form data
  // - Check if the submission was NOT OK, if NOT OK -> pass errors from the action state to 'errors'
  React.useEffect(() => {
    if (state.success) {
      refreshLists();
      mutate(`bookmarks-${currentListId}`);
      setOpen(false);
    } else {
      setErrors(state.errors ? state.errors : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // What this does: reset the list name field and set errors to an empty array (resetting the error)
  const resetForm = () => {
    if (!open) {
      setErrors([]);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        resetForm();
        setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            bookmark.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <form action={action}>
            {/* We need to pass the current bookmark's id to the formData but cannot pass it to the action */}
            {/* This is the recommended work-around */}
            <input type="hidden" name="bookmarkId" value={bookmarkId} />
            <AlertDialogAction type="submit" disabled={pending}>
              Delete
            </AlertDialogAction>
          </form>
          {errors.map((error, index) => (
            <p
              aria-live="polite"
              key={index}
              className="text-destructive-foreground"
            >
              {error}
            </p>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteBookmarkDialog;
