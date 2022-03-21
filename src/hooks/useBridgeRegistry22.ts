import { useState } from 'react'

import { IBridge } from '@interfaces/data'

export const useBridgeRegistry = (): {
  bridges: IBridge[]
  selectedBridge: IBridge | null
  register: (bridges: IBridge[]) => void
  selectBridge: (bridgeId: IBridge['id']) => void
} => {
  const [bridges, setBridges] = useState<IBridge[]>([] as IBridge[])
  const [selectedBridge, setSelectBridge] = useState<IBridge>(null)

  const register = (bridges: IBridge[]) => {
    setBridges(bridges)
  }

  const selectBridge = (bridgeId: IBridge['id']) => {
    const selectedBridge = bridges.find(({ id }) => id === bridgeId)
    setSelectBridge(selectedBridge)
  }

  return {
    register,
    bridges,
    selectedBridge,
    selectBridge,
  }
}
