import CollectionView from "@/components/CollectionView";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <CollectionView />
    </div>
  );
}
