import * as React from "react";
import ModeToggle from "../ModeToggle";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";

function Sidebar() {
  return (
    <div className="flex flex-col min-h-[100svh] h-[100%] border-r">
      <div className="flex px-4 gap-4 justify-between items-center h-14 border-b w-64 lg:w-72">
        <h1 className="font-bold text-lg">QuickSave</h1>
        <ModeToggle />
      </div>
      <div className="flex flex-col p-4">
        <Button variant="default" className="text-left justify-start">
          <CirclePlus />
          Add new list
        </Button>
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <p className="font-semibold px-4 text-sm mb-2">Your Lists</p>
        <Button className="justify-between cursor-pointer" variant="ghost">
          <p>Development</p>
          <p className="text-muted-foreground text-xs font-normal">14</p>
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
