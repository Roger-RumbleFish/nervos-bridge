export default {
  nervos: {
    ckb: {
      url: 'https://testnet.ckb.dev',
    },
    godwoken: {
      rpcUrl: 'https://godwoken-testnet-web3-rpc.ckbapp.dev',
      wsUrl: 'wss://godwoken-testnet-web3-rpc.ckbapp.dev/ws',
      networkId: '0x116e1',
    },
    indexer: {
      url: 'https://testnet.ckb.dev/indexer',
    },
    rollupTypeHash:
      '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
    rollupTypeScript: {
      codeHash:
        '0x5c365147bb6c40e817a2a53e0dec3661f7390cc77f0c02db138303177b12e9fb',
      hashType: 'type',
      args:
        '0x213743d13048e9f36728c547ab736023a7426e15a3d7d1c82f43ec3b5f266df2',
    },
    ethAccountLockCodeHash:
      '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
    depositLockScriptTypeHash:
      '0x5a2506bb68d81a11dcadad4cb7eae62a17c43c619fe47ac8037bc8ce2dd90360',
    portalWalletLockHash:
      '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
  },
  bridge: {
    ethereum: {
      forceBridge: {
        url: 'https://testnet.forcebridge.com/api/force-bridge/api/v1',
      }
    },
    bsc: {
      forceBridge: {
        url: 'https://testnet.forcebridge.com/bscapi/force-bridge/api/v1',
      }
    },
  },
  ethereum: {
    networkId: '0x4',
  },
}
