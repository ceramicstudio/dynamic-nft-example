import React, { FormEvent, useState } from "react";
import { useCeramic } from "use-ceramic";
import styles from "../../styles/mint.module.css";
import { TileDocument } from "@ceramicnetwork/stream-tile";

export function CreateStream(props: {
  onCreate: (tile: TileDocument) => void;
}) {
  const ceramic = useCeramic();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [progress, setProgress] = useState(false);
  const [streamId, setStreamId] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(true);
    if (!name) {
      setProgress(false);
      alert("Add name");
    }
    if (!description) {
      setProgress(false);
      alert("Add description");
    }
    if (!file) {
      setProgress(false);
      alert("Add file");
    }
    const formData = new FormData();
    formData.set("file", file!);
    fetch("/api/persist", { method: "POST", body: formData })
      .then((r) => r.json())
      .then(async (c) => {
        const cid = c.cid;
        // @ts-ignore
        const tile = await TileDocument.create(ceramic.client, {
          name: name,
          description: description,
          image: cid,
        });
        setStreamId(tile.id.toString());
        props.onCreate(tile);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const renderStreamId = () => {
    if (!streamId) {
      return <></>;
    } else {
      return (
        <div className={`${styles.inputGroup} mt-3 p-2 rounded-lg bg-gray-100`}>
          <label htmlFor="stream-id" className={styles.inputTextLabel}>
            StreamID
          </label>
          <input
            type="text"
            disabled={true}
            name="stream-id"
            id="stream-id"
            value={streamId}
          />
        </div>
      );
    }
  };

  const formClassName = progress ? styles.disabledForm : "";

  return (
    <>
      <h1>1. Create Ceramic stream</h1>
      <form onSubmit={handleSubmit} className={formClassName}>
        <div className={styles.inputGroup}>
          <label htmlFor="token-name" className={styles.inputTextLabel}>
            Name
          </label>
          <input
            disabled={progress}
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
            disabled={progress}
            name="token-description"
            id="token-description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </div>
        <div className={`${styles.inputGroup} mb-3`}>
          <label htmlFor="token-image" className={styles.inputTextLabel}>
            Initial Image
          </label>
          <input
            disabled={progress}
            type="file"
            name="token-image"
            id="token-image"
            onChange={(event) => setFile(event.currentTarget.files?.[0])}
          />
        </div>

        <button type={"submit"} disabled={progress}>
          Create stream
        </button>
        {renderStreamId()}
      </form>
    </>
  );
}
