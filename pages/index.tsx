import { useCeramic } from "use-ceramic";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";

function SignInWithCeramic(props: React.PropsWithChildren<{}>) {
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
    return <>{props.children}</>;
  } else {
    return renderButton();
  }
}

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ceramic Starter</title>
        <meta name="description" content="Ceramic Starter App" />
      </Head>
      <main className={styles.main}>
        <div className={styles.logo}>🔸🌱</div>
        <SignInWithCeramic>
          <div className={"text-center w-full"}>
            <hr />
            <Link href={"/mint"} shallow={true}>
              Mint
            </Link>{" "}
            or{" "}
            <Link href={"/view"} shallow={true}>
              View
            </Link>
          </div>
        </SignInWithCeramic>
      </main>
    </div>
  );
}
