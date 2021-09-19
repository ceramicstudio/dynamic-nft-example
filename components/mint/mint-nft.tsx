import React, { FormEvent, useState } from "react";
import { Web3Ethereum } from "@rarible/web3-ethereum";
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import { useWeb3 } from "../use-web3";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import styles from "../../styles/mint.module.css";
import * as ethers from "ethers";
import { RaribleContractArtifact } from "./rarible-contract-artifact";
import * as uint8arrays from "uint8arrays";
import { toAddress } from "@rarible/types";

function StoreMetadata(props: {
  metadata: any;
  onMetadataCid: (cid: string) => void;
}) {
  const [progress, setProgress] = useState(false);
  const [metadataCid, setMetadataCid] = useState(null);

  const handleStoreMetadata = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(true);
    const blob = JSON.stringify(props.metadata);
    const file = new File([blob], "metadata.json");
    const formData = new FormData();
    formData.set("file", file);
    fetch("/api/persist", { method: "POST", body: formData })
      .then((r) => r.json())
      .then((response) => {
        const cid = response.cid;
        setMetadataCid(cid);
        props.onMetadataCid(cid);
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
          value={JSON.stringify(props.metadata, null, 4)}
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

function MintToken(props: { metadata: any; metadataCid: string }) {
  const [progress, setProgress] = useState(false);
  const web3 = useWeb3();
  const rarible = createRaribleSdk(new Web3Ethereum(web3), web3.networkName, {
    fetchApi: fetch.bind(window),
  });
  // const contractAddress = "0x6ede7f3c26975aad32a475e1021d8f6f39c89d82"; // rinkeby
  const chainId = web3.chainId.toString();
  // @ts-ignore
  const contractAddress = RaribleContractArtifact.networks[chainId].address;
  if (!contractAddress) {
    return <p>No Rarible contract found for chainId {chainId}</p>;
  }
  const minter = web3.account;
  const tokenIdEndpoint = `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${contractAddress}/generate_token_id?minter=${minter}`;

  function packedTokenId(tokenId: number) {
    const minterBytes = uint8arrays.fromString(
      minter.toLowerCase().replace("0x", ""),
      "base16"
    );
    const tokenHex = tokenId.toString(16);
    const paddedTokenHex = tokenHex.length % 2 == 0 ? tokenHex : `0${tokenHex}`;
    const tokenBytes = uint8arrays.fromString(paddedTokenHex, "base16");
    const fullLength = 32; // uin256 in bytes
    const paddingLength =
      fullLength - tokenBytes.byteLength - minterBytes.byteLength;
    const padding = new Uint8Array(paddingLength);
    const resultingBytes = uint8arrays.concat([
      minterBytes,
      padding,
      tokenBytes,
    ]);
    return "0x" + uint8arrays.toString(resultingBytes, "base16");
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(true);
    fetch(tokenIdEndpoint)
      .then((r) => r.json())
      .then(async (tokenIdResponse) => {
        // const mintResult = await rarible.nft.mint({
        //   lazy: false,
        //   collection: {
        //     id: contractAddress,
        //     type: "ERC721",
        //     supportsLazyMint: false,
        //   },
        //   uri: props.metadataCid,
        //   creators: [{ account: toAddress(minter), value: 10000 }],
        //   royalties: [{ account: toAddress(minter), value: 1000 }],
        // });
        // console.log('m', mintResult)
        const provider = new ethers.providers.Web3Provider(web3.provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          RaribleContractArtifact.abi,
          signer
        );
        const uri = props.metadataCid;
        const tokenId = packedTokenId(tokenIdResponse.tokenId as number);
        const tx = await contract.mintAndTransfer(
          [
            tokenId,
            uri,
            [[minter, 10000]], // You can assign one or add multiple creators, but the value must total 10000
            [[minter, 1000]], // Royalties are set as basis point, so 1000 = 10%.
            ["0x"],
          ],
          minter
        );
        console.log("tx", tx);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  if (!props.metadataCid) {
    return <></>;
  }

  const formClassName = progress ? styles.disabledForm : "";
  return (
    <form onSubmit={handleSubmit} className={`mt-3 ${formClassName}`}>
      <button type={"submit"} disabled={progress}>
        Mint ERC721 token
      </button>
    </form>
  );
}

export function MintNft(props: { tile?: TileDocument }) {
  const [metadataCid, setMetadataCid] = useState("");

  if (!props.tile) {
    return <></>;
  }

  const metadata = {
    name: props.tile.content.name,
    description: props.tile.content.description,
    image: `ipfs://${props.tile.content.image}`,
    ceramicContent: `ceramic://${props.tile.id.toString()}`,
  };

  return (
    <>
      <h1>2. MintNFT</h1>
      <StoreMetadata
        metadata={metadata}
        onMetadataCid={(cid) => setMetadataCid(cid)}
      />
      <MintToken metadata={metadata} metadataCid={metadataCid} />
    </>
  );
}
