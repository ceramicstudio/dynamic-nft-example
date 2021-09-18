import { useCeramic } from "use-ceramic";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";

function UsernameIDX() {
  const ceramic = useCeramic();
  const [name, setName] = useState("");

  useEffect(() => {
    if (ceramic.isAuthenticated && !name) {
      ceramic.idx
        .get<{ name: string | undefined }>("basicProfile")
        .then((profile) => {
          if (profile && profile.name) {
            setName(profile.name);
          }
        });
    }
  });

  if (name) {
    return (
      <p>
        Name from IDX: <code className={styles.verbatim}>{name}</code>
      </p>
    );
  } else {
    return <></>;
  }
}

function SignInWithCeramic() {
  const ceramic = useCeramic();
  const [authenticated, setAuthenticated] = useState(ceramic.isAuthenticated);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const subscription = ceramic.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        setAuthenticated(isAuthenticated);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  });

  const handleLogin = async () => {
    setProgress(true);
    try {
      const authProvider = await ceramic.connect();
      await ceramic.authenticate(authProvider);
    } catch (e) {
      console.error(e);
    } finally {
      setProgress(false);
    }
  };

  const renderButton = () => {
    if (progress) {
      return (
        <>
          <button disabled={true}>Connecting...</button>
        </>
      );
    } else {
      return (
        <>
          <button onClick={handleLogin}>Sign In</button>
        </>
      );
    }
  };

  if (authenticated) {
    return (
      <>
        <hr />
        <p>
          <strong>
            Congratulations! You have just signed in with Ceramic!
          </strong>
        </p>
        <p>
          Your DID: <code className={styles.verbatim}>{ceramic.did.id}</code>
        </p>
        <UsernameIDX />
      </>
    );
  } else {
    return (
      <>
        <p>Try it yourself!</p>
        {renderButton()}
      </>
    );
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ceramic Starter</title>
        <meta name="description" content="Ceramic Starter App" />
      </Head>
      <main className={styles.main}>
        <div className={styles.logo}>
          <img
            src="/logo-ceramic.svg"
            alt="Ceramic Logo"
          />
        </div>
        <p>
          This is a <a href={"https://ceramic.network"}>Ceramic</a> and{" "}
          <a href={"https://idx.xyz/"}>IDX</a> starter app. You can freely use
          it as a base for your application.
        </p>
        <p>
          The app allows a user to sign in with Ethereum wallet, and displays
          her DID.
        </p>
        <SignInWithCeramic />
      </main>
    </div>
  );
}
