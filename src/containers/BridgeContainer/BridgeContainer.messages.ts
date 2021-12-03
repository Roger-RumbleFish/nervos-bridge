export const messages = {
  BRIDGE_TITLE: 'Bridge',
  BRIDGE_DESCRIPTION:
    'Only use personal wallets. Depositing from an exchange may cause loss of funds',
  DEPOSIT_LABEL: 'Deposit',
  WITHDRAW_LABEL: 'Withdraw',
}

export const errorMessages = {
  transactionNotSupportedTemplate(
    transactionName: string,
    withdrawalNetworkName: string,
    depositNetworkName: string,
  ): string {
    return `${transactionName} from ${withdrawalNetworkName} to ${depositNetworkName} currently not supported`
  },
}
