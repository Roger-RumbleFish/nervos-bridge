export default {
  nervos: {
    ckb: {
      url: 'https://rpc.ckb.tools/',
    },
    godwoken: {
      rpcUrl: 'https://mainnet.godwoken.io/rpc',
      wsUrl: 'wss://mainnet.godwoken.io/ws',
      networkId: '0x116e2',
    },
    indexer: {
      url: 'https://indexer.ckb.tools/',
    },
    rollupTypeHash:
      '0x40d73f0d3c561fcaae330eabc030d8d96a9d0af36d0c5114883658a350cb9e3b',
    rollupTypeScript: {
      codeHash:
        '0xa9267ff5a16f38aa9382608eb9022883a78e6a40855107bb59f8406cce00e981',
      hashType: 'type',
      args:
        '0x2d8d67c8d73453c1a6d6d600e491b303910802e0cc90a709da9b15d26c5c48b3',
    },
    ethAccountLockCodeHash:
      '0x1563080d175bf8ddd44a48e850cecf0c0b4575835756eb5ffd53ad830931b9f9',
    depositLockScriptTypeHash:
      '0xe24164e2204f998b088920405dece3dcfd5c1fbcb23aecfce4b3d3edf1488897',
    portalWalletLockHash:
      '0xbf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc',
    forceBridgeUrl: 'https://forcebridge.com/api/force-bridge/api/v1',
  },
  ethereum: {
    networkId: '0x1',
  },
}
