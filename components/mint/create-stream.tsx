import React from "react";
import { CeramicService, useCeramic } from "use-ceramic";
import styles from "../../styles/mint.module.css";

export function CreateStream() {
  const ceramic = useCeramic();

  return (
    <>
      <h1>1. Create Ceramic stream</h1>
      <form>
        <div className={styles.inputGroup}>
          <label htmlFor="token-name" className={styles.inputTextLabel}>
            Name
          </label>
          <input type="text" name="token-name" id="token-name" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="token-description" className={styles.inputTextLabel}>
            Description
          </label>
          <input type="text" name="token-description" id="token-description" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="token-image" className={styles.inputTextLabel}>
            Initial Image
          </label>
          <input type="file" name="token-image" id="token-image" />
        </div>
        <button type={"submit"} className={"mt-3"}>Create stream</button>
      </form>
    </>
  );
}
