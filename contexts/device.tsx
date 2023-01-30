import {useContext, createContext} from 'react'

export const DeviceContext = createContext(null)

export function useDeviceContext() {
  const context = useContext(DeviceContext)

  return context
}

export default useDeviceContext
