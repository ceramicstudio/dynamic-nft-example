import React, { FormEvent, useState } from "react";
import { Web3Ethereum } from "@rarible/web3-ethereum";
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import { useWeb3 } from "../use-web3";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import styles from "../../styles/mint.module.css";

function StoreMetadata(props: { tile: TileDocument }) {
  const [progress, setProgress] = useState(false);
  const [metadataCid, setMetadataCid] = useState(null);

  const metadata = {
    name: props.tile.content.name,
    description: props.tile.content.description,
    image: `ipfs://${props.tile.content.image}`,
    ceramicContent: `ceramic://${props.tile.id.toString()}`,
  };

  const handleStoreMetadata = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(true);
    const blob = JSON.stringify(metadata);
    const file = new File([blob], "metadata.json");
    const formData = new FormData();
    formData.set("file", file);
    fetch("/api/persist", { method: "POST", body: formData })
      .then((r) => r.json())
      .then((response) => {
        const cid = response.cid;
        setMetadataCid(cid);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const renderMetadataCid = () => {
    if (!metadataCid) {
      return <></>;
    } else {
      return (
        <div className={`${styles.inputGroup} mt-3 p-2 rounded-lg bg-gray-100`}>
          <label htmlFor="metadata-cid" className={styles.inputTextLabel}>
            Metadata CID
          </label>
          <input
            type="text"
            disabled={true}
            name="metadata-cid"
            id="metadata-cid"
            value={metadataCid}
          />
        </div>
      );
    }
  };

  const formClassName = progress ? styles.disabledForm : "";
  return (
    <form onSubmit={handleStoreMetadata} className={formClassName}>
      <div className={styles.inputGroup}>
        <label htmlFor="token-name" className={styles.inputTextLabel}>
          Metadata JSON
        </label>
        <textarea
          className={"mb-3"}
          disabled={true}
          value={JSON.stringify(metadata, null, 4)}
          rows={6}
        />
        <button type={"submit"} disabled={progress}>
          Store metadata on IPFS
        </button>
      </div>
      {renderMetadataCid()}
    </form>
  );
}

export function MintNft(props: { tile?: TileDocument }) {
  // const web3 = useWeb3();
  // const rarible = createRaribleSdk(new Web3Ethereum(web3), web3.networkName, {
  //   fetchApi: fetch,
  // });

  if (!props.tile) {
    return <></>;
  }

  return (
    <>
      <h1>2. MintNFT</h1>
      <StoreMetadata tile={props.tile} />
    </>
  );
}
