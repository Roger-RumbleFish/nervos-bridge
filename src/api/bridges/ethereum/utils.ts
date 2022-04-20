import { Network } from '@interfaces/data'

enum ForceBridgeNetwork {
  Ethereum = 'Ethereum',
  Nervos = 'Nervos',
}

export const mapForceBridgeNetwork = (network: string): Network =>
  network === ForceBridgeNetwork.Ethereum ? Network.Ethereum : Network.CKB
