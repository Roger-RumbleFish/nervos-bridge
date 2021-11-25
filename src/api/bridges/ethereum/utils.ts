import { Networks } from '@utils/constants'

enum ForceBridgeNetwork {
  Ethereum = 'Ethereum',
  Nervos = 'Nervos',
}

export const mapForceBridgeNetwork = (network: string): Networks =>
  network === ForceBridgeNetwork.Ethereum ? Networks.Ethereum : Networks.CKB
