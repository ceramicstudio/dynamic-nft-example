import { Layout } from "../components/layout";
import styles from "../styles/mint.module.css";
import React, { FormEvent, useEffect, useState } from "react";
import { useWeb3 } from "../components/use-web3";
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import { Web3Ethereum } from "@rarible/web3-ethereum";
import { RaribleContractArtifact } from "../components/mint/rarible-contract-artifact";
import * as ethers from "ethers";
import { useCeramic } from "use-ceramic";
import { StreamID } from "@ceramicnetwork/streamid";
import { TileDocument } from "@ceramicnetwork/stream-tile";

function MetadataFind(props: { onMetadata: (metadata: any) => void }) {
  const [progress, setProgress] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  const web3 = useWeb3();
  // const contractAddress = "0x6ede7f3c26975aad32a475e1021d8f6f39c89d82"; // rinkeby

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(true);
    const provider = new ethers.providers.Web3Provider(web3.provider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      RaribleContractArtifact.abi,
      signer
    );
    contract
      .tokenURI(tokenId)
      .then(async (result: string) => {
        const tokenURI = result.replace(/^ipfs:\/\/?/, "");
        const contents = await fetch(
          `https://${tokenURI}.ipfs.dweb.link/`
        ).then((r) => r.json());
        props.onMetadata(contents);
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const formClassName = progress ? styles.disabledForm : "";
  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className={`${styles.inputGroup} mb-3`}>
        <label htmlFor="contract-address" className={styles.inputTextLabel}>
          Contract
        </label>
        <input
          disabled={progress}
          type="text"
          name="contract-address"
          id="contract-address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.currentTarget.value)}
        />
        <label htmlFor="token-id" className={styles.inputTextLabel}>
          Token ID
        </label>
        <input
          disabled={progress}
          type="text"
          name="token-id"
          id="token-id"
          value={tokenId}
          onChange={(e) => setTokenId(e.currentTarget.value)}
        />
      </div>
      <button type={"submit"} disabled={progress}>
        Find
      </button>
    </form>
  );
}

function MetadataDisplay(props: { metadata: any }) {
  return (
    <div className={`${styles.inputGroup} mt-3 p-2 rounded-lg bg-gray-100`}>
      <label htmlFor="metadata" className={styles.inputTextLabel}>
        ERC721 Metadata
      </label>
      <textarea
        disabled={true}
        name="metadata"
        id="metadata"
        value={JSON.stringify(props.metadata, null, 4)}
        rows={6}
      />
    </div>
  );
}

function HistoryView(props: { tile: TileDocument }) {
  const ceramic = useCeramic();
  const [selectedCid, setSelectedCid] = useState(
    props.tile.state.log[0].cid.toString()
  );
  const [progress, setProgress] = useState(true);
  const [content, setContent] = useState<any>(undefined);
  const [log, setLog] = useState(props.tile.state.log);

  useEffect(() => {
    const subscription = props.tile.subscribe((state) => {
      if (state.log.length != log.length) {
        setLog(state.log);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  const logEntries = log.map((entry, index) => {
    const isSelected = entry.cid.toString() == selectedCid;
    const selectedClass = isSelected ? "bg-gray-200" : "bg-gray-50";
    return (
      <div
        key={`log-${index}`}
        className={`p-2 mr-2 rounded-md cursor-pointer ${selectedClass}`}
        onClick={() => setSelectedCid(entry.cid.toString())}
      >
        {index}
      </div>
    );
  });

  useEffect(() => {
    setProgress(true);
    const commitId = props.tile.id.atCommit(selectedCid);
    // @ts-ignore
    TileDocument.load(ceramic.client, commitId)
      .then((tile) => {
        setContent(tile.content);
      })
      .finally(() => {
        setProgress(false);
      });
  }, [selectedCid, props.tile]);

  const renderContent = () => {
    if (content) {
      const imageCid = content.image;
      return (
        <div>
          <textarea
            value={JSON.stringify(content, null, 4)}
            readOnly={true}
            rows={5}
          />
          <div>
            <img
              src={`https://${imageCid}.ipfs.dweb.link/`}
              className={"object-contain"}
            />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const handleAdd = (file: File) => {
    setProgress(true);
    const formData = new FormData();
    formData.set("file", file);
    fetch("/api/persist", { method: "POST", body: formData })
      .then((r) => r.json())
      .then(async (c) => {
        const cid = c.cid;
        await props.tile.update({
          ...props.tile.content,
          image: cid,
        });
        console.log("updated", props.tile.state.log);
        // @ts-ignore
        // const tile = await TileDocument.create(ceramic.client, {
        //   name: name,
        //   description: description,
        //   image: cid,
        // });
        // setStreamId(tile.id.toString());
        // props.onCreate(tile);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  return (
    <div className={`${styles.inputGroup} mt-3 p-2 rounded-lg bg-gray-100`}>
      <div className={"flex"}>
        {logEntries}
        <div
          className={`mr-2 rounded-md ${progress ? "" : "hover:bg-gray-300"}`}
        >
          <label
            className={`bg-red p-2 block ${
              progress ? styles.pulsation : "cursor-pointer"
            }`}
          >
            {progress ? "◇" : "+"}
            <input
              type={"file"}
              className={"hidden"}
              disabled={progress}
              onChange={(event) => handleAdd(event.currentTarget.files?.[0]!)}
            />
          </label>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

function CeramicContent(props: { streamId: string }) {
  const ceramic = useCeramic();
  const streamId = StreamID.fromString(props.streamId);
  const [tile, setTile] = useState<TileDocument | undefined>(undefined);

  useEffect(() => {
    if (tile) {
      return;
    }
    // @ts-ignore
    TileDocument.load<Record<string, any>>(ceramic.client, streamId)
      .then((tile) => {
        setTile(tile);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.streamId]);

  if (tile) {
    return <HistoryView tile={tile} />;
  } else {
    return <p>Loading...</p>;
  }
}

export default function View() {
  const [metadata, setMetadata] = useState<any | undefined>(undefined);

  const handleMetadata = (metadata: any) => {
    setMetadata(metadata);
  };

  const renderMetadata = () => {
    if (metadata) {
      return <MetadataDisplay metadata={metadata} />;
    } else {
      return <></>;
    }
  };

  const renderCeramicContents = () => {
    if (metadata && metadata.ceramicContent) {
      return <CeramicContent streamId={metadata.ceramicContent} />;
    } else {
      return <></>;
    }
  };

  return (
    <Layout>
      <MetadataFind onMetadata={handleMetadata} />
      {renderMetadata()}
      {renderCeramicContents()}
    </Layout>
  );
}
