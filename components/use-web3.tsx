import { ICoreOptions } from "web3modal";
import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useContext } from "react";

const ALLOWED_NETWORKS = ["ropsten", "rinkeby", "mainnet"];
type AllowedNetworks = "ropsten" | "rinkeby" | "mainnet";

export class Web3Service {
  private _web3: Web3 | undefined = undefined;
  private _provider: any;
  readonly networkName: AllowedNetworks;

  constructor(readonly options: Partial<ICoreOptions>) {
    if (!options.network) options.network = "rinkeby";
    if (ALLOWED_NETWORKS.includes(options.network)) {
      this.networkName = options.network! as AllowedNetworks;
    } else {
      throw new Error(`Disallowed network ${options.network}`);
    }
  }

  async connect() {
    const web3Modal = new Web3Modal(this.options);
    this._provider = await web3Modal.connect();
    this._web3 = new Web3(this._provider);
  }

  get provider(): any {
    if (this._provider) {
      return this._provider;
    } else {
      throw new Error(`connect first`);
    }
  }

  get web3(): Web3 {
    if (this._web3) {
      return this._web3;
    } else {
      throw new Error(`connect first`);
    }
  }
}

export const Web3Context = React.createContext<Web3Service | null>(null);

export type Web3ProviderOpts = {
  service: Web3Service;
  render?: (ceramic: Web3Service) => React.ReactElement;
};

export function Web3Provider(props: React.PropsWithChildren<Web3ProviderOpts>) {
  const service = props.service;
  const renderBody = () => {
    if (props.render) {
      return props.render(service);
    } else {
      return props.children;
    }
  };
  return (
    <Web3Context.Provider value={service}>{renderBody()}</Web3Context.Provider>
  );
}

export function useWeb3(): Web3Service {
  const service = useContext(Web3Context);
  if (service) {
    return service;
  } else {
    throw new Error(`Please wrap with CeramicProvider`);
  }
}
