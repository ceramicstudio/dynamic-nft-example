import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { CeramicProvider, CeramicService, Networks } from "use-ceramic";

const ceramicService = new CeramicService(Networks.MAINNET);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CeramicProvider service={ceramicService}>
      <Component {...pageProps} />
    </CeramicProvider>
  );
}
export default MyApp;
