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

export function getCaretIndex(element: any) {
  let position = 0
  const isSupported = typeof window.getSelection !== 'undefined'
  if (isSupported) {
    const selection = window.getSelection()
    if (selection!.rangeCount !== 0) {
      const range = window.getSelection()!.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      position = preCaretRange.toString().length
    }
  }
  return position
}

export const setCaretIndex = (el: any, pos: any) => {
  // Loop through all child nodes
  for (var node of el.childNodes) {
    if (node.nodeType === 3) {
      // we have a text node
      if (node.length >= pos) {
        // finally add our range
        var range = document.createRange(),
          sel = window.getSelection()
        range.setStart(node, pos)
        range.collapse(true)
        sel!.removeAllRanges()
        sel!.addRange(range)
        return -1 // we are done
      } else {
        pos -= node.length
      }
    } else {
      pos = setCaretIndex(node, pos)
      if (pos === -1) {
        return -1 // no need to finish the for loop
      }
    }
  }
  return pos // needed because of recursion stuff
}

export function capitalise_first(string: string | undefined) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1)
  else return ''
}

export function capitalise_words(string: string | undefined) {
  if (string)
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  else return ''
}
