import React, {FormEvent, useState} from "react";
import { CeramicService, useCeramic } from "use-ceramic";
import styles from "../../styles/mint.module.css";

export function CreateStream() {
  const ceramic = useCeramic();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('name', name)
    console.log('description', description)
    console.log('file', file)
  }

  return (
    <>
      <h1>1. Create Ceramic stream</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="token-name" className={styles.inputTextLabel}>
            Name
          </label>
          <input
            type="text"
            name="token-name"
            id="token-name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="token-description" className={styles.inputTextLabel}>
            Description
          </label>
          <input
            type="text"
            name="token-description"
            id="token-description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="token-image" className={styles.inputTextLabel}>
            Initial Image
          </label>
          <input
            type="file"
            name="token-image"
            id="token-image"
            onChange={(event) => setFile(event.currentTarget.files?.[0])}
          />
        </div>

        <button type={"submit"} className={"mt-3"}>
          Create stream
        </button>
      </form>
    </>
  );
}
