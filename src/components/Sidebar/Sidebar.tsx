import * as React from "react";
import ModeToggle from "../ModeToggle";
import { Button } from "../ui/button";
import AddNewListDialog from "../AddNewListDialog";
import { List } from "@/types";

interface SidebarProps {
  lists: Array<List>;
}

function Sidebar({ lists }: SidebarProps) {
  return (
    <div className="flex flex-col min-h-[100svh] border-r bg-muted/40">
      <div className="flex px-4 gap-4 justify-between items-center h-14 border-b w-64 lg:w-72">
        <h1 className="font-bold text-lg">QuickSave</h1>
        <ModeToggle />
      </div>
      <div className="flex flex-col p-4">
        <AddNewListDialog />
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <p className="font-semibold px-4 text-sm mb-2">Your Lists</p>

        {lists.map((list) => (
          <Button
            className="justify-between cursor-pointer"
            variant="ghost"
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
}

export default Sidebar;
