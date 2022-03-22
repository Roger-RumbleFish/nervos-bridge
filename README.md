# Nervos Bridge

Library providing React component for Nervos blockchain assets bridging

# Setup

1. install the library to your project
   `npm i nervos-bridge`

2. Import the components to your application
   `import BridgeComponent from 'nervos-bridge`

3. Add the component to your DOM 
   Mainnet setup
   ```
   const provider = new providers.Web3Provider(ethereum)

   const addressTranslatorMainnet = new AddressTranslator({
      CKB_URL: MainnetConfig.nervos.ckb.url,
      RPC_URL: MainnetConfig.nervos.godwoken.rpcUrl,
      INDEXER_URL: MainnetConfig.nervos.indexer.url,
      deposit_lock_script_type_hash: MainnetConfig.nervos.depositLockScriptTypeHash,
      eth_account_lock_script_type_hash: MainnetConfig.nervos.ethAccountLockCodeHash,
      rollup_type_script: {
        code_hash: MainnetConfig.nervos.rollupTypeScript.codeHash,
        hash_type: MainnetConfig.nervos.rollupTypeScript.hashType,
        args: MainnetConfig.nervos.rollupTypeScript.args,
      },
      rollup_type_hash: MainnetConfig.nervos.rollupTypeHash,
      portal_wallet_lock_hash: MainnetConfig.nervos.portalWalletLockHash,
    })

   <BridgeComponent
      network={Network.Mainnet}
      provider={provider}
      addressTranslator={addressTranslatorMainnet}
      config={{
         godwokenRpcUrl: MainnetConfig.nervos.godwoken.rpcUrl,
         ckbRpcUrl: MainnetConfig.nervos.ckb.url,
         ckbIndexerUrl: MainnetConfig.nervos.indexer.url,
         depositLockScriptTypeHash: MainnetConfig.nervos.depositLockScriptTypeHash,
         ethAccountLockCodeHash: MainnetConfig.nervos.ethAccountLockCodeHash,
         rollupTypeHash: MainnetConfig.nervos.rollupTypeHash,
         bridge: {
            forceBridge: {
               url: MainnetConfig.bridge.ethereum.bridges.forceBridge.url,
            },
         },
      }}
   />
  

# Configuration

provider - web3Provider with logged in account  
config?: - (Optional. Default Testnet) configuration for rpc faucet url and Nervos blockchain configuration

# Test locally
1. clone the repository
2. run `yarn`
3. run `yarn dev`

![Alt text](readme/bridge.png 'Bridge storybook')
