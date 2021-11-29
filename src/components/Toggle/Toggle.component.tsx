import React from 'react'

import { Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import { IToggleProps } from './Toggle.types'

const Toggle: React.FC<IToggleProps> = ({ toggles, onToggleChange }) => {
  const [selected, setSelected] = React.useState(toggles[0].id)

  const handleChange = (value: string) => {
    setSelected(value)
    onToggleChange?.(value)
  }

  return (
    <Box display="flex" justifyContent="space-between" padding={0.25}>
      {toggles.map((toggle) => (
        <Box
          key={toggle.id}
          width="100%"
          boxSizing="content-box"
          flexBasis="49.95%"
        >
          <Button
            fullWidth
            color="primary"
            variant={selected === toggle.id ? 'contained' : 'outlined'}
            onClick={() => handleChange(toggle.id)}
          >
            {toggle.name}
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default Toggle
