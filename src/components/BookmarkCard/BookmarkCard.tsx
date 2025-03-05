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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Skeleton } from "../ui/skeleton";
import DeleteBookmarkDialog from "../DeleteBookmarkDialog";

interface BookmarkCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  imageSrc: string;
  parentSite: string;
  isDraggable: boolean;
  // This is for revalidation after removing a Bookmark
  currentListId: string;
}

function BookmarkCard({
  id,
  title,
  description,
  url,
  imageSrc,
  parentSite,
  isDraggable,
  currentListId,
}: BookmarkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Recommended styling for smooth and fancy dragging
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // When it's dragging time, turn into a div to prevent accidentally opening a link
  const Comp = isDraggable ? "div" : "a";

  return (
    <Comp
      href={isDraggable ? undefined : url}
      target={isDraggable ? undefined : "_blank"}
      className="group touch-none"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <Card className="overflow-hidden h-[100%] justify-between">
        <div className="-mt-6 relative">
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Preview image"
              className="w-[100%] h-[200px] group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
          {isDraggable === false && (
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
                <DeleteBookmarkDialog
                  bookmarkId={id}
                  currentListId={currentListId}
                >
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e: Event) => {
                      e.preventDefault();
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DeleteBookmarkDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardContent className="flex flex-col gap-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          {parentSite}
        </CardFooter>
      </Card>
    </Comp>
  );
}

export function SkeletonBookmarkCard() {
  return (
    <Card className="overflow-hidden">
      <div className="-mt-6 relative">
        <div className="overflow-hidden">
          <Skeleton className="w-[100%] h-[150px]" />
        </div>
      </div>
      <CardContent className="flex flex-col gap-2">
        <CardTitle>
          <Skeleton className="w-[100%] h-4" />
        </CardTitle>
        <CardDescription className="text-xs">
          <Skeleton className="w-[100%] h-4" />
        </CardDescription>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <Skeleton className="w-[100%] h-4" />
      </CardFooter>
    </Card>
  );
}

export default BookmarkCard;
