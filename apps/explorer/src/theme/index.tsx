import React, { PropsWithChildren, useMemo } from 'react'

import { themeMapper } from '@cowprotocol/ui'

import { useThemeMode } from 'hooks/useThemeManager'
import {
  DefaultTheme,
  isStyledComponent,
  StyledComponent,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components/macro'

import { getFonts, getThemePalette } from './styles'

export * from './styles'
export * from './types'

// This type is all React.ReactElement & StyledComponents combined
type ReactOrStyledNode = React.ReactElement &
  StyledComponent<keyof JSX.IntrinsicElements, Record<string, unknown>, Record<string, unknown>, never>

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
const ThemeProvider = ({ children }: PropsWithChildren) => {
  const mode = useThemeMode()

  const themeObject = useMemo(() => {
    const themePalette = getThemePalette(mode)
    const fontPalette = getFonts(mode)

    const computedTheme: DefaultTheme = {
      ...themeMapper(mode),
      mode,
      // Compute the app colour pallette using the passed in themeMode
      ...themePalette,
      ...fontPalette,
    }

    return computedTheme
  }, [mode])

  // We want to pass the ThemeProvider theme to all children implicitly, no need to manually pass it
  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {React.Children.map(children as ReactOrStyledNode, (child: ReactOrStyledNode) =>
        // is not null/undefined/0
        React.isValidElement(child) || isStyledComponent(child)
          ? React.cloneElement(child, {
              theme: themeObject,
            })
          : // if not, don't pass props and just return
            child
      )}
    </StyledComponentsThemeProvider>
  )
}

export default ThemeProvider
