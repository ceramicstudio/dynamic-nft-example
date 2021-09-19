import { Layout } from "../components/layout";
import { useCeramic } from "use-ceramic";
import { CreateStream } from "../components/mint/create-stream";
import { TileDocument } from "@ceramicnetwork/stream-tile";

export default function Mint() {
  const handleCreateStream = (tile: TileDocument) => {
    console.log("created", tile);
  };

  return (
    <Layout>
      <CreateStream onCreate={handleCreateStream} />
    </Layout>
  );
}
