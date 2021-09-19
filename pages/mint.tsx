import { Layout } from "../components/layout";
import { useCeramic } from "use-ceramic";
import { CreateStream } from "../components/mint/create-stream";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { MintNft } from "../components/mint/mint-nft";
import { useState } from "react";

export default function MintPage() {
  const [tile, setTile] = useState<TileDocument | undefined>(undefined);

  const handleCreateStream = (tile: TileDocument) => {
    setTile(tile);
  };

  return (
    <Layout>
      <CreateStream onCreate={handleCreateStream} />
      <MintNft tile={tile} />
    </Layout>
  );
}
