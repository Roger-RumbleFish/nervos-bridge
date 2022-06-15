import { Environment } from '../interfaces/data'

export const mapGodwokenEnvironment = (
  envirinment: Environment,
): 'testnet' | 'mainnet' => {
  switch (envirinment) {
    case Environment.Testnet:
      return 'testnet'
    case Environment.Mainnet:
      return 'mainnet'
  }
}
