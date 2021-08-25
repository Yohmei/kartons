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

export function useTraceUpdate(props: any) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: any, [k, v]: any) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}
