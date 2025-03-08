"use client";

import CollectionView from "@/components/CollectionView";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { useLists } from "@/hooks/useLists";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Home() {
  const {
    lists,
    error: listsError,
    isValidating: listsLoading,
    currentList,
    setCurrentListId,
  } = useLists();

  const {
    bookmarks,
    isValidating: bookmarksLoading,
    error: bookmarksError,
  } = useBookmarks(currentList?.id ?? null);

  if (listsError) return <p>Error loading lists: ${listsError}</p>;
  if (bookmarksError) return <p>Error loading bookmarks: ${bookmarksError}</p>;

  return (
    <div className="flex">
      <Sidebar
        lists={lists}
        skeleton={listsLoading}
        currentListId={currentList?.id}
        setCurrentListId={setCurrentListId}
      />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-muted/40"></header>
        <CollectionView
          skeleton={bookmarksLoading}
          noListSelected={currentList === null}
          bookmarks={bookmarks}
          currentListName={currentList?.name}
          currentListId={currentList?.id}
        />
      </div>
    </div>
  );
}
