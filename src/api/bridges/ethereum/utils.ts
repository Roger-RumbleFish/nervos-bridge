import { Networks } from '@utils/constants'

enum ForceBridgeNetworks {
  Ethereum = 'Ethereum',
  Nervos = 'Nervos',
}

export const mapForceBridgeNetwork = (network: string): Networks =>
  network === ForceBridgeNetworks.Ethereum ? Networks.Ethereum : Networks.CKB
