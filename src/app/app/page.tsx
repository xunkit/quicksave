"use client";

import CollectionView from "@/components/CollectionView";
import Sidebar from "@/components/Sidebar";
import useSWRImmutable from "swr/immutable";
import { getBookmarksByListId, getListsByUser } from "../actions";
import React from "react";
import { List } from "@/types";

export default function Home() {
  // I'm using useSWRImmutable instead of useSWR
  // Which means: it only re-fetches when I mutate the path. Or else stay the same
  // If I used useSWR it would refetch like crazy (especially with isValidating)

  const {
    data: lists,
    error: listsError,
    isValidating: listsLoading,
  } = useSWRImmutable("lists", getListsByUser);
  const [currentListId, setCurrentListId] = React.useState<string | null>(null);
  const currentListName = currentListId
    ? lists.find((list: List) => list.id === currentListId).name
    : null;

  const {
    data: bookmarks,
    error: bookmarksError,
    isValidating: bookmarksLoading,
  } = useSWRImmutable(currentListId ? `bookmarks-${currentListId}` : null, () =>
    getBookmarksByListId(currentListId!)
  );

  if (listsError) return <p>Error loading lists: ${listsError}</p>;
  if (bookmarksError) return <p>Error loading bookmarks: ${bookmarksError}</p>;

  return (
    <div className="flex">
      <Sidebar
        lists={lists}
        skeleton={listsLoading}
        currentListId={currentListId}
        setCurrentListId={setCurrentListId}
      />
      <CollectionView
        skeleton={bookmarksLoading}
        noListSelected={currentListId === null}
        bookmarks={bookmarks}
        currentListName={currentListName}
        currentListId={currentListId}
      />
    </div>
  );
}
