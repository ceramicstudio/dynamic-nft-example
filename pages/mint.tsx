import { Layout } from "../components/layout";
import { useCeramic } from "use-ceramic";
import { CreateStream } from "../components/mint/create-stream";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { MintNft } from "../components/mint/mint-nft";
import { useState } from "react";
import { ChangeController } from "../components/mint/change-controller";

export default function MintPage() {
  const [tile, setTile] = useState<TileDocument | undefined>(undefined);
  const [token, setToken] = useState<
    { contract: string; tokenId: string } | undefined
  >(undefined);

  const handleMint = (contract: string, tokenId: string) => {
    setToken({
      contract,
      tokenId,
    });
  };

  const handleCreateStream = (tile: TileDocument) => {
    setTile(tile);
  };

  const renderMint = () => {
    if (tile) {
      return <MintNft tile={tile} onDone={handleMint} />;
    } else {
      return <></>;
    }
  };

  const renderChangeController = () => {
    if (token && tile) {
      return <ChangeController tile={tile} token={token} />;
    } else {
      return <></>;
    }
  };

  return (
    <Layout>
      <CreateStream onCreate={handleCreateStream} />
      {renderMint()}
      {renderChangeController()}
    </Layout>
  );
}
