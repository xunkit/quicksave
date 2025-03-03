import CollectionView from "@/components/CollectionView";
import Sidebar from "@/components/Sidebar";
import { getListByUser } from "../actions";

export default async function Home() {
  const lists = await getListByUser();

  return (
    <div className="flex">
      <Sidebar lists={lists} />
      <CollectionView />
    </div>
  );
}
