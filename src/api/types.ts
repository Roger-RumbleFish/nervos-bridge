import { Networks } from "@utils/constants";

export enum CanonicalTokenSymbol {
    DAI = "DAI",
    USDT = "USDT",
    USDC = "USDC",
    ETH = "ETH",
    CKB = "CKB",
    dCKB = "dCKB"
}

export interface TokenDescriptor {
    address: string
    name: string
    decimals: number
}

export interface TokensRegistry {
    network: Networks,
    tokens: {
        [key in CanonicalTokenSymbol]?: TokenDescriptor
    }
}
