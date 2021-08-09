import React from 'react';

import { ThemeProvider } from '../src/styles/theme'

const StylesDecorator = storyFn => {

  return (
    <ThemeProvider>
      {storyFn()}
    </ThemeProvider>
  )
}

export default StylesDecorator;
