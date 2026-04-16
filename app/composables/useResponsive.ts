import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

type UseResponsiveOptions = {
  ssrWidth?: number
}

export const useResponsive = (options: UseResponsiveOptions = {}) => {
  const breakpoints = useBreakpoints(breakpointsTailwind, {
    ssrWidth: options.ssrWidth ?? breakpointsTailwind.sm,
  })

  const smOrSmaller = breakpoints.smallerOrEqual('sm')

  return {
    breakpoints,
    smOrSmaller,
  }
}

