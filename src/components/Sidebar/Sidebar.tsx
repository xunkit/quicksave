import * as React from "react";
import ModeToggle from "../ModeToggle";
import { Button } from "../ui/button";
import AddNewListDialog from "../AddNewListDialog";
import { List } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteListDialog from "../DeleteListDialog";
import EditListDialog from "../EditListDialog";

interface SidebarProps {
  skeleton: boolean;
  lists: Array<List>;
  currentListId: string | null;
  setCurrentListId: (listId: string) => void;
}

function Sidebar({
  lists,
  skeleton,
  currentListId,
  setCurrentListId,
}: SidebarProps) {
  if (!skeleton)
    return (
      <div className="flex flex-col min-h-[100svh] border-r bg-muted/40">
        <div className="flex px-4 gap-4 justify-between items-center h-14 border-b w-64 lg:w-72">
          <h1 className="font-bold text-lg">QuickSave</h1>
          <ModeToggle />
        </div>
        <div className="flex flex-col p-4">
          <AddNewListDialog />
        </div>
        <div className="flex flex-col p-4 gap-2">
          <p className="font-semibold px-4 text-sm mb-2">Your Lists</p>

          {lists.map((list) => (
            <div key={list.id} className="w-[100%] relative">
              <Button
                className={`justify-between cursor-pointer w-[100%] ${
                  list.id === currentListId ? "bg-accent" : ""
                }`}
                variant="ghost"
                onClick={() => setCurrentListId(list.id)}
              >
                <p>{list.name}</p>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground text-xs font-normal aspect-square absolute right-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />

                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditListDialog listId={list.id} defaultListName={list.name}>
                    <DropdownMenuItem
                      onSelect={(e: Event) => {
                        e.preventDefault();
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </EditListDialog>
                  <DropdownMenuSeparator />
                  <DeleteListDialog listId={list.id}>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e: Event) => {
                        e.preventDefault();
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DeleteListDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    );

  return <SkeletonSidebar />;
}

function SkeletonSidebar() {
  return (
    <div className="flex flex-col min-h-[100svh] border-r bg-muted/40">
      <div className="flex px-4 gap-4 justify-between items-center h-14 border-b w-64 lg:w-72">
        <h1 className="font-bold text-lg">QuickSave</h1>
        <ModeToggle />
      </div>
      <div className="flex flex-col p-4">
        <AddNewListDialog />
      </div>
      <div className="flex flex-col p-4 gap-2">
        <p className="font-semibold px-4 text-sm mb-2">Your Lists</p>
        <div className="flex flex-col gap-2 px-2">
          <Skeleton className="w-[100%] h-6" />
          <Skeleton className="w-[100%] h-6" />
          <Skeleton className="w-[100%] h-6" />
          <Skeleton className="w-[100%] h-6" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
