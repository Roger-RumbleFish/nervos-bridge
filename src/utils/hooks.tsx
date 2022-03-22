import { useEffect, useMemo, useState, createContext } from 'react'

import { IBridge } from '@interfaces/data'

import { IBridgeContainerProps } from '../containers/BridgeContainer/BridgeContainer.types'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useSelectors(reducer: any, mapStateToSelectors: any) {
  const [state] = reducer
  const selectors = useMemo(() => mapStateToSelectors(state), [state])
  return selectors
}

export function useActions(reducer: any, mapDispatchToActions: any) {
  const [, dispatch] = reducer
  const actions = useMemo(() => mapDispatchToActions(dispatch), [dispatch])
  return actions
}

export interface IConfigContext {
  bridge?: IBridge
  provider?: IBridgeContainerProps['provider']
  polyjuiceProvider?: IBridgeContainerProps['provider']
  config?: IBridgeContainerProps['config']
}

const ConfigContext = createContext<IConfigContext>(null)

export { ConfigContext }
