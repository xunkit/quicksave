import * as React from "react";
import ModeToggle from "../ModeToggle";
import { Button } from "../ui/button";
import AddNewListDialog from "../AddNewListDialog";
import { List } from "@/types";
import { Skeleton } from "../ui/skeleton";

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
            <Button
              className={`justify-between cursor-pointer ${
                list.id === currentListId ? "bg-accent" : ""
              }`}
              variant="ghost"
              onClick={() => setCurrentListId(list.id)}
              key={list.id}
            >
              <p>{list.name}</p>
              <p className="text-muted-foreground text-xs font-normal">
                {list.bookmarks.length}
              </p>
            </Button>
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
