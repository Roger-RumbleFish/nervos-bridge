import { Networks } from "@utils/constants";
import { CanonicalTokenSymbol, TokensRegistry } from "@api/types";


export const registry: TokensRegistry = {
    network: Networks.CKB,
    tokens: {
        [CanonicalTokenSymbol.CKB]: {
            address: '0x0000000000000000000000000000000000000000000000000000000000000000',
            name: 'CKB',
            decimals: 8,
        },
        [CanonicalTokenSymbol.dCKB]: {
            address: '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e',
            name: 'dCKB',
            decimals: 8,
        },
        [CanonicalTokenSymbol.DAI]: {
            address: '0xcb8c7b352d88142993bae0f6a1cfc0ec0deac41e3377a2f7038ff6b103548353',
            name: 'ckDai',
            decimals: 8,
        },
        [CanonicalTokenSymbol.USDC]: {
            address: '0x5497b6d3d55443d573420ca8e413ee1be8553c6f7a8a6e36bf036bf71f0e3c39',
            name: 'ckUSDC',
            decimals: 6,
        },
        [CanonicalTokenSymbol.USDT]: {
            address: '0xf0a746d4d8df5c18826e11030c659ded11e7218b854f86e6bbdc2af726ad1ec3',
            name: 'ckUSDT',
            decimals: 6,
        },
    }
}