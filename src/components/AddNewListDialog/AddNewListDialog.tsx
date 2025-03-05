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
import { addNewList } from "@/app/actions";
import { ActionState } from "@/types";
import { mutate } from "swr";

const initialState: ActionState = {
  success: false,
  message: "",
  errors: [],
};

function AddNewListDialog() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [state, action, pending] = React.useActionState(
    addNewList,
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
      mutate("lists");
    } else {
      setErrors(state.errors ? state.errors : []);
    }
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
          New List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
          <DialogDescription>
            Enter a name for your new list. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                name="newListName"
                required
              />
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

export default AddNewListDialog;
