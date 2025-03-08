"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { editBookmark } from "@/app/actions";
import { ActionState } from "@/types";
import { mutate } from "swr";

const initialState: ActionState = {
  success: false,
  message: "",
  errors: [],
};

interface EditBookmarkDialogProps {
  bookmarkId: string;
  currentListId: string;
  defaultTitle: string;
  defaultDescription: string;
  children: React.ReactNode;
}

function EditBookmarkDialog({
  bookmarkId,
  currentListId,
  defaultTitle,
  defaultDescription,
  children,
}: EditBookmarkDialogProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [state, action, pending] = React.useActionState(
    editBookmark,
    initialState
  );
  const [errors, setErrors] = React.useState<Array<string>>([]);

  // Every time the form is submitted, this is triggered.
  // What it does:
  // - Check if the submission was OK, if OK -> close the form and erase form data
  // - Check if the submission was NOT OK, if NOT OK -> pass errors from the action state to 'errors'
  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
      mutate(`bookmarks-${currentListId}`);
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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        resetForm();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
          <DialogDescription>
            Enter a name for your new list. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <input type="hidden" value={bookmarkId} name="bookmarkId" />
              <div className="flex items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  defaultValue={defaultTitle}
                  className="col-span-3"
                  name="title"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  defaultValue={defaultDescription}
                  className="col-span-3"
                  name="description"
                />
              </div>
            </div>
          </div>
          {errors.map((error, index) => (
            <p
              aria-live="polite"
              key={index}
              className="text-destructive-foreground"
            >
              {error}
            </p>
          ))}
          <DialogFooter>
            <Button type="submit" disabled={pending} className="mt-4">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookmarkDialog;
