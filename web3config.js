import { configureChains, createClient } from "wagmi"
import {
    EthereumClient, modalConnectors, walletConnectProvider
} from "@web3modal/ethereum"
import * as allchains from 'wagmi/chains'
import appContracts from './contracts.json'

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
    throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
}

const availableChains = Object.values(allchains).filter(
    c => Object.keys(appContracts).includes(c.id.toString())
)

let chains

switch(process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV) {
    case "development":
        chains = [allchains.localhost].concat(availableChains.filter(c => c.network != "localhost"))
        break
    case "preview":
        chains = availableChains.filter(c => c.network != "localhost")
        break
    default:
        chains = availableChains.filter(c => !c.testnet && c.network != "localhost")
        break
}

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const { provider } = configureChains(
    chains, [ walletConnectProvider({ projectId }) ]
)

export const wagmiClient = createClient({
    connectors: modalConnectors({ appName: "upt", chains }),
    autoConnect: true,
    provider
})

export const ethereumClient = new EthereumClient(wagmiClient, chains)

export const web3config = {
    projectId: projectId,
    ethereumClient: ethereumClient,
    enableNetworkView: false
}
