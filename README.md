# Nervos Bridge

Library providing React component for Nervos blockchain assets bridging

# Setup

1. install the library to your project
   `npm i nervos-bridge`

2. Import the components to your application (async)  
   `const BridgeComponent = React.lazy(() => import('nervos-bridge'))`  
   or  
   `import BridgeComponent from 'nervos-bridge`

3. Add the component to your DOM (async)
   ```
   <Suspense fallback={<div>...Loading</div>}>
    <BridgeComponent
      provider={web3Provider}
      userAddress="0x742971ac86E36152B9aac7090cF0B5C0acaa90F4"
      assetsBlacklist={[]}
    />
   </Suspense>
   ```
   or
   ```
    <BridgeComponent
      provider={web3Provider}
      userAddress="0x742971ac86E36152B9aac7090cF0B5C0acaa90F4"
      assetsBlacklist={[]}
    />
   ```

# Configuration

provider - web3Provider with logged in account  
assetsBlacklist: string[] - assets that will be ignored  
config?: - (Optional) configuration for rpc faucet url and Nervos blockchain configuration

# Test locally

1. clone the repository
2. run `yarn`
3. run `yarn storybook`

![alt text](https://github.com/Roger-RumbleFish/nervos-bridge/blob/master/bridge.png?raw=true)
