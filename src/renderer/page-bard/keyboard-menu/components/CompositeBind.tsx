import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps
} from '@mui/material'
import { ReactNode } from 'react'
import { CompositeConfig } from 'store/bardSlice'

const selectOption = [
  { label: 'Shift', value: 'Shift' },
  { label: 'Alt', value: 'Alt' },
  { label: 'Ctrl', value: 'Control' }
]

const compositeList: { label: string; key: 'higher' | 'lower' }[] = [
  { label: '高八度', key: 'higher' },
  { label: '低八度', key: 'lower' }
]

export const CompositeBind = ({
  compositeConfig,
  setCompositeConfig,
  sx,
  children
}: {
  compositeConfig: CompositeConfig
  setCompositeConfig: (arg: CompositeConfig) => void
  sx?: SxProps
  children: ReactNode
}) => {
  type CompositeConfigKey = keyof CompositeConfig

  const handleChangBind = (key: CompositeConfigKey, code: string) => {
    // 重复处理
    const clonedCompositeConfig = {
      ...compositeConfig
    }
    if (key === 'higher' && clonedCompositeConfig['lower'] === code) {
      clonedCompositeConfig['lower'] = clonedCompositeConfig['higher']
    } else if (key === 'lower' && clonedCompositeConfig['higher'] === code) {
      clonedCompositeConfig['higher'] = clonedCompositeConfig['lower']
    }
    clonedCompositeConfig[key] = code
    setCompositeConfig(clonedCompositeConfig)
  }

  return (
    <Box
      sx={{
        mt: 2,
        ml: 2,
        ...sx
      }}>
      {compositeList.map(({ label, key }) => (
        <Box
          sx={{
            mb: 1
          }}
          key={key}>
          {label}
          <Select
            size="small"
            sx={{
              ml: 1,
              '& .MuiSelect-select': {
                padding: '2px 32px 2px 10px'
              }
            }}
            value={compositeConfig[key]}
            onChange={(e: SelectChangeEvent) =>
              handleChangBind(key, e.target.value)
            }>
            {selectOption.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ))}
      {children}
    </Box>
  )
}

export default CompositeBind
