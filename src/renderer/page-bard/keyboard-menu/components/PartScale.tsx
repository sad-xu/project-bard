import { Box } from '@mui/material'
import { forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { selectKeyConfig } from '../../../store/bardSlice'
import CompositeBind from './CompositeBind'
import { BindItem } from './FullScale'
import KeyBind from './KeyBind'
import { useScaleKey } from './utils'

const KEY_LIST: [number, string][][] = [
  [
    [0, '1'],
    [2, '2'],
    [4, '3'],
    [5, '4'],
    [7, '5'],
    [9, '6'],
    [11, '7'],
    [12, 'i']
  ],
  [
    [1, '1 ♯'],
    [3, '3 ♭'],
    [6, '4 ♯'],
    [8, '5 ♯'],
    [10, '7 ♭']
  ]
]

const PartScale = forwardRef((props, ref) => {
  const keyConfig = useSelector(selectKeyConfig)

  const { keyList, setKeyList, compositeConfig, setCompositeConfig } =
    useScaleKey(keyConfig, [
      { note: 60, label: '' },
      { note: 61, label: '' },
      { note: 62, label: '' },
      { note: 63, label: '' },
      { note: 64, label: '' },
      { note: 65, label: '' },
      { note: 66, label: '' },
      { note: 67, label: '' },
      { note: 68, label: '' },
      { note: 69, label: '' },
      { note: 70, label: '' },
      { note: 71, label: '' },
      { note: 72, label: '' }
    ])

  // 对外暴露方法
  useImperativeHandle(ref, () => ({
    getScaleKeys: () => ({
      ...compositeConfig,
      common: keyList.reduce((acc, item) => {
        if (item.label) {
          acc[item.label] = item.note
        }
        return acc
      }, {} as { [key: string]: number })
    })
  }))

  /** 音符绑定 */
  const handleChangeBind = (item: BindItem, code: string, i: number) => {
    console.log(item, code)
    const newKeyList = keyList.concat()
    newKeyList[i].label = code
    // 去重
    newKeyList.forEach((it, j) => {
      if (j !== i && it.label === code) {
        it.label = ''
      }
    })
    setKeyList(newKeyList)
    // 半音检查
    if (
      compositeConfig.highSemitone === code ||
      compositeConfig.lowSemitone === code
    ) {
      const obj = { ...compositeConfig }
      let key: keyof typeof obj
      for (key in obj) {
        if (
          obj[key] === code &&
          (key === 'highSemitone' || key === 'lowSemitone')
        ) {
          obj[key] = ''
        }
      }
      setCompositeConfig(obj)
    }
  }

  /** 半音绑定 */
  const handleChangeSemitone = (
    key: 'highSemitone' | 'lowSemitone',
    code: string
  ) => {
    // 半音去重
    const copyed = { ...compositeConfig }
    if (key === 'highSemitone' && copyed.lowSemitone === code) {
      copyed.lowSemitone = ''
    } else if (key === 'lowSemitone' && copyed.highSemitone === code) {
      copyed.highSemitone = ''
    }
    copyed[key] = code
    setCompositeConfig(copyed)
    // 音符去重
    if (keyList.some((item) => item.label === code)) {
      const newKeyList = keyList.concat()
      newKeyList.forEach((item) => {
        if (item.label === code) {
          item.label = ''
        }
      })
      setKeyList(newKeyList)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {KEY_LIST[0].map((item) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              key={item[0]}>
              <div
                style={{
                  width: '20px',
                  textAlign: 'center'
                }}>
                {item[1]}
              </div>
              <KeyBind
                sx={{ mb: 0 }}
                label={keyList[item[0]].label}
                changeBind={(code: string) =>
                  handleChangeBind(keyList[item[0]], code, item[0])
                }
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ ml: 1 }}>
          {KEY_LIST[1].map((item) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              key={item[0]}>
              <div
                style={{
                  width: '30px',
                  textAlign: 'center'
                }}>
                {item[1]}
              </div>
              <KeyBind
                sx={{ mb: 0 }}
                label={keyList[item[0]].label}
                changeBind={(code: string) =>
                  handleChangeBind(keyList[item[0]], code, item[0])
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
      <CompositeBind
        sx={{ mt: 0 }}
        compositeConfig={compositeConfig}
        setCompositeConfig={setCompositeConfig}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <span>高半音</span>
          <KeyBind
            label={compositeConfig.highSemitone}
            changeBind={(code: string) =>
              handleChangeSemitone('highSemitone', code)
            }
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>低半音</span>
          <KeyBind
            label={compositeConfig.lowSemitone}
            changeBind={(code: string) =>
              handleChangeSemitone('lowSemitone', code)
            }
          />
        </Box>
      </CompositeBind>
    </Box>
  )
})

export default PartScale
