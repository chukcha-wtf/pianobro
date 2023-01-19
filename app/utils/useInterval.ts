import React, { useEffect, useRef } from "react"

/**
 * useInterval - the hook that will call the passed in function every interval (in milliseconds)
 * with an option to control either the interval or execution of the function.
 * @param callback - the function to call every interval
 * @param delay - the interval in milliseconds
 */

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
