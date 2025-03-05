import { getListsByUser } from "@/app/actions";
import { List } from "@/types";
import React from "react";
import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

export function useLists() {
  // I'm using useSWRImmutable instead of useSWR
  // Which means: it only re-fetches when I mutate the path. Or else stay the same
  // If I used useSWR it would refetch like crazy (especially with isValidating)
  const {
    data: lists,
    error,
    isValidating,
  } = useSWRImmutable("lists", getListsByUser);
  const [currentListId, setCurrentListId] = React.useState<string | null>(null);

  // Get the currently selected list object
  const currentList =
    lists?.find((list: List) => list.id === currentListId) || null;

  // Silent refresh function
  const refreshLists = async () => {
    await mutate("lists", getListsByUser(), { revalidate: false });
  };

  return {
    lists,
    error,
    isValidating,
    refreshLists,
    currentList,
    currentListId,
    setCurrentListId,
  };
}
