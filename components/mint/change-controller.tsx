import { TileDocument } from "@ceramicnetwork/stream-tile";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../../styles/mint.module.css";
import { createNftDidUrl } from "nft-did-resolver";
import { useWeb3 } from "../use-web3";
import BigNumber from "bignumber.js";
import { useCeramic } from "use-ceramic";

export function ChangeController(props: {
  tile: TileDocument;
  token: { contract: string; tokenId: string };
}) {
  const web3 = useWeb3();

  const [currentController, setCurrentController] = useState(
    props.tile.controllers[0]
  );
  const [progress, setProgress] = useState(false);

  const nextController = createNftDidUrl({
    chainId: `eip155:${web3.chainId}`,
    namespace: `erc721`,
    tokenId: props.token.tokenId,
    contract: props.token.contract.toLowerCase(),
  });

  useEffect(() => {
    const subscription = props.tile.subscribe(() => {
      if (props.tile.controllers[0] !== currentController) {
        setCurrentController(currentController);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [props.tile]);

  const handleChangeClick = () => {
    setProgress(true);
    props.tile
      .update(undefined, {
        controllers: [nextController],
      })
      .then(async () => {
        console.log("updated");
        await props.tile.sync();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const renderButton = () => {
    if (props.tile.controllers[0] !== nextController) {
      return (
        <button onClick={handleChangeClick} disabled={progress}>
          Change!
        </button>
      );
    } else {
      return <div className={"text-6xl text-center"}>🪴</div>;
    }
  };

  const formClassName = progress ? styles.disabledForm : "";
  return (
    <>
      <h1>3. Change Controller</h1>
      <form className={formClassName} onSubmit={handleSubmit}>
        <div className={`${styles.inputGroup} mb-3`}>
          <label htmlFor="current-controller" className={styles.inputTextLabel}>
            Current Controller
          </label>
          <input
            disabled={true}
            type="text"
            name="current-controller"
            id="current-controller"
            value={currentController}
          />
          <label htmlFor="next-controller" className={styles.inputTextLabel}>
            DID-NFT Controller
          </label>
          <input
            disabled={true}
            type="text"
            name="next-controller"
            id="next-controller"
            value={nextController}
          />
        </div>
        {renderButton()}
      </form>
    </>
  );
}
