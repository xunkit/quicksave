import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Copy, MoreHorizontal, Star, Trash } from "lucide-react";

function BookmarkCard() {
  return (
    <a href="https://unsplash.com" target="_blank" className="group">
      <Card className="overflow-hidden">
        <div className="-mt-6 relative">
          <img
            src="https://images.unsplash.com/photo-1723118641440-485d9630c3c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Preview image"
            className="w-[100%] group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 absolute right-2.5 top-2.5"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                <span>Favorite</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy URL</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="flex flex-col gap-2">
          <CardTitle>
            A sculpture is shown against a blue sky - Unsplash
          </CardTitle>
          <CardDescription className="text-xs">Cool design</CardDescription>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          www.unsplash.com
        </CardFooter>
      </Card>
    </a>
  );
}

export default BookmarkCard;
