import { TileDocument } from "@ceramicnetwork/stream-tile";
import React from "react";

export function ChangeController(props: {
  tile: TileDocument;
  token: { contract: string; tokenId: string } | undefined;
}) {
  return (
    <>
      <h1>3. Change Controller</h1>
    </>
  );
}
