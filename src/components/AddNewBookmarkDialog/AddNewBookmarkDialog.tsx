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
import { CirclePlus } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addNewBookmark } from "@/app/actions";
import { ActionState } from "@/types";
import { mutate } from "swr";
import { useLists } from "@/hooks/useLists";

const initialState: ActionState = {
  success: false,
  message: "",
  errors: [],
};

interface AddNewBookmarkDialogProps {
  currentListId: string;
}

function AddNewBookmarkDialog({ currentListId }: AddNewBookmarkDialogProps) {
  const { refreshLists } = useLists();

  const [open, setOpen] = React.useState<boolean>(false);
  const [state, action, pending] = React.useActionState(
    addNewBookmark,
    initialState
  );
  const [errors, setErrors] = React.useState<Array<string>>([]);

  // Every time the form is submitted, this is triggered.
  // What it does:
  // - Check if the submission was OK, if OK -> close the form and refetch the data
  // - Check if the submission was NOT OK, if NOT OK -> pass errors from the action state to 'errors'
  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
      mutate(`bookmarks-${currentListId}`);
      // Silently re-fetch the lists (does NOT trigger revalidation = no loading skeleton!!)
      refreshLists();
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
      <DialogTrigger asChild>
        <Button variant="default" className="text-left justify-start">
          <CirclePlus />
          New Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Bookmark</DialogTitle>
          <DialogDescription>
            Add a new bookmark. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          {/* We need to pass currentListId to the formData but cannot pass it to the action */}
          {/* This is the recommended work-around */}
          <input type="hidden" name="listId" value={currentListId} />
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Link
                </Label>
                <Input id="link" className="col-span-3" name="link" required />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" name="title" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
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

export default AddNewBookmarkDialog;
