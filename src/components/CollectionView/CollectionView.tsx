import * as React from "react";
import { Input } from "../ui/input";
import { CirclePlus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import BookmarkCard from "../BookmarkCard";

function CollectionView() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b"></header>
      <div className="flex items-center px-4 h-14 border-b">
        <h2 className="font-bold flex-1">Development</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4" />
            <Input
              type="search"
              className="pl-8 w-[200px] hover:bg-accent"
              placeholder="Search"
            />
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[100px] hover:bg-accent">
              <SelectValue placeholder="Sort by" className="hover:bg-accent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <CirclePlus />
            New Bookmark
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
        <BookmarkCard />
        <BookmarkCard />
        <BookmarkCard />
        <BookmarkCard />
        <BookmarkCard />
        <BookmarkCard />
      </div>
    </div>
  );
}

export default CollectionView;
