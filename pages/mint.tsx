import { Layout } from "../components/layout";
import { useCeramic } from "use-ceramic";
import { CreateStream } from "../components/mint/create-stream";

export default function Mint() {
  return (
    <Layout>
      <CreateStream />
    </Layout>
  );
}
