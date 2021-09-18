import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CeramicProvider, Networks } from "use-ceramic";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CeramicProvider network={Networks.MAINNET}>
      <Component {...pageProps} />
    </CeramicProvider>
  );
}
export default MyApp;
