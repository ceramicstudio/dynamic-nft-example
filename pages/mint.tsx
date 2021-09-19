import { Layout } from "../components/layout";
import { useCeramic } from "use-ceramic";
import { CreateStream } from "../components/mint/create-stream";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { MintNft } from "../components/mint/mint-nft";

export default function Mint() {
  const handleCreateStream = (tile: TileDocument) => {
    console.log("created", tile);
  };

  return (
    <Layout>
      <CreateStream onCreate={handleCreateStream} />
      <MintNft />
    </Layout>
  );
}
