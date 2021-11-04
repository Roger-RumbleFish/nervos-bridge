import { Networks } from '../../../utils/constants'

export interface ITokenConfig {
  [key: string]: {
    id: string
    name: string
    decimals: number
    network: Networks
  }
}

export function inverseBridgeNetwork(network: Networks): Networks {
  return network === Networks.NervosL1 ? Networks.NervosL2 : Networks.NervosL2
}

export const TokenConfig: ITokenConfig = {
  '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e': {
    id: '0xd64488E7E97242F3cd18627458907c0f1455d946',
    name: 'dCKB',
    decimals: 8,
    network: Networks.NervosL2,
  },
  '0x0000000000000000000000000000000000000000000000000000000000000000': {
    id: '0x0000000000000000000000000000000000000000',
    name: 'CKB',
    decimals: 8,
    network: Networks.NervosL2,
  },
}
