import { getBookmarksByListId } from "@/app/actions";
import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

export function useBookmarks(currentListId: string | null) {
  const shouldFetch = Boolean(currentListId); // Prevents fetching if no list is selected

  const {
    data: bookmarks,
    error,
    isValidating,
  } = useSWRImmutable(shouldFetch ? `bookmarks-${currentListId}` : null, () =>
    getBookmarksByListId(currentListId!)
  );

  // Silent refresh function
  const refreshBookmarks = async () => {
    if (!currentListId) return;
    await mutate(
      `bookmarks-${currentListId}`,
      getBookmarksByListId(currentListId),
      { revalidate: false }
    );
  };

  return {
    bookmarks,
    error,
    isValidating,
    refreshBookmarks,
  };
}
