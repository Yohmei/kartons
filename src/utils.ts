import { useEffect, useRef } from 'react'
import rfdc from 'rfdc'

const clone = rfdc()

export const s = (element: string) => {
  return document.querySelector(element) as HTMLElement
}

export const sa = (elements: string) => {
  return document.querySelectorAll(elements) as NodeListOf<HTMLElement>
}

export const r_id = () => '_' + Math.random().toString(36).substr(2)

export const remove_arr_item = (arr: Array<any>, i: number) => {
  arr.splice(i, 1)
  return clone(arr)
}
export const replace_arr_item = (arr: Array<any>, i: number, new_item: any) => {
  arr.splice(i, 0, new_item)
  return clone(arr)
}

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function useWhyDidYouUpdate(name: any, props: any) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef()
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      // @ts-ignore
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      // Use this object to keep track of changed props
      const changesObj = {}
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        // @ts-ignore
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          // @ts-ignore
          changesObj[key] = {
            // @ts-ignore
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj)
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props
  })
}
