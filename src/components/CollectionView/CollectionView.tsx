"use client";

import * as React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import BookmarkCard from "../BookmarkCard";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import FloatingEditButton from "../FloatingEditButton";
import { Bookmark } from "@/types";
import AddNewBookmarkDialog from "../AddNewBookmarkDialog";

function CollectionView() {
  const [items, setItems] = React.useState<Array<Bookmark>>([
    {
      title: "A sculpture is shown against a blue sky - Unsplash",
      description: "cool image",
      imageSrc:
        "https://images.unsplash.com/photo-1723118641440-485d9630c3c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "https://unsplash.com",
      parentSite: "www.unsplash.com",
      id: 1,
    },
    {
      title: "A sculpture is shown against a blue sky - Unsplash",
      description: "cool image",
      imageSrc:
        "https://images.unsplash.com/photo-1723118641440-485d9630c3c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "https://unsplash.com",
      parentSite: "www.unsplash.com",
      id: 2,
    },
    {
      title: "A sculpture is shown against a blue sky - Unsplash",
      description: "cool image",
      imageSrc:
        "https://images.unsplash.com/photo-1723118641440-485d9630c3c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "https://unsplash.com",
      parentSite: "www.unsplash.com",
      id: 3,
    },
    {
      title: "A sculpture is shown against a blue sky - Unsplash",
      description: "cool image",
      imageSrc:
        "https://images.unsplash.com/photo-1723118641440-485d9630c3c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "https://unsplash.com",
      parentSite: "www.unsplash.com",
      id: 4,
    },
  ]);

  // DRAG AND DROP LOGIC ↓↓ ----------------------------
  // NOTE: 'item' is referring to BOOKMARK

  // isDraggable: This value becomes true when the user has clicked the Edit button
  const [isDraggable, setIsDraggable] = React.useState<boolean>(false);

  // getItemPosition: get Item's index
  const getItemPosition = (id: number) => {
    return items.findIndex((item) => item.id === Number(id));
  };

  // onDragEnd: re-sort the array of Items
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((items) => {
      const originalPosition = getItemPosition(Number(active.id));
      const newPosition = getItemPosition(Number(over.id));

      return arrayMove(items, originalPosition, newPosition);
    });
  };

  // sensors: Configuring sensors so mobile/keyboard users can also drag
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Common bug in the library: DnDContext needs an id, otherwise will throw Hydration Error
  const id = React.useId();

  // DRAG AND DROP LOGIC ↑↑ ----------------------------

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b bg-muted/40"></header>
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
          <AddNewBookmarkDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 overflow-hidden">
        <DndContext
          id={id}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={items}
            strategy={rectSwappingStrategy}
            disabled={!isDraggable}
          >
            {items.map((item) => (
              <BookmarkCard
                title={`${item.title} ${item.id}`}
                description={item.description}
                imageSrc={item.imageSrc}
                url={item.url}
                parentSite={item.parentSite}
                isDraggable={isDraggable}
                id={item.id}
                key={item.id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <FloatingEditButton
        isEditing={isDraggable}
        onClick={() => {
          setIsDraggable(!isDraggable);
        }}
      />
    </div>
  );
}

export default CollectionView;
