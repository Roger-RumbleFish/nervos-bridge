import { useEffect } from 'react'

import { fetchSupportedTokens } from '@api/fetchSupportedTokens'

export const useDupa = (): void => {
  useEffect(() => {
    const test = async () => {
      const tokens = await fetchSupportedTokens()
      console.log('eee', tokens)
    }

    test()
  }, [])
}
