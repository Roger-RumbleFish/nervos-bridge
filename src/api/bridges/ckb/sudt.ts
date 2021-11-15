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
  return network === Networks.NervosL1 ? Networks.NervosL2 : Networks.NervosL1
}

export const TokenConfigByL1: ITokenConfig = {
  '0x0000000000000000000000000000000000000000000000000000000000000000': {
    id: '0x0000000000000000000000000000000000000000',
    name: 'CKB',
    decimals: 8,
    network: Networks.NervosL2,
  },
  '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e': {
    id: '0xd64488E7E97242F3cd18627458907c0f1455d946',
    name: 'dCKB',
    decimals: 8,
    network: Networks.NervosL2,
  },
  '0xcb8c7b352d88142993bae0f6a1cfc0ec0deac41e3377a2f7038ff6b103548353': {
    id: '0x84c57202bCe3c784A1723F680dD38Cf6a2292d92',
    name: 'ckDai',
    decimals: 88,
    network: Networks.NervosL2,
  },
  '0x5497b6d3d55443d573420ca8e413ee1be8553c6f7a8a6e36bf036bf71f0e3c39': {
    id: '0x50ce6b8abe7E6943750b55283a155bb6cB5acFaB',
    name: 'ckUSDC',
    decimals: 6,
    network: Networks.NervosL2,
  },
  '0xf0a746d4d8df5c18826e11030c659ded11e7218b854f86e6bbdc2af726ad1ec3': {
    id: '0xD92dd1f7b17990B3EefB0104E9e4dC7B54e74e10',
    name: 'ckUSDT',
    decimals: 6,
    network: Networks.NervosL2,
  },
}
