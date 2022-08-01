import { Box } from '@mui/material'
import { useImperativeHandle, forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { selectKeyConfig } from '../../../store/bardSlice'
import CompositeBind from './CompositeBind'
import KeyBind from './KeyBind'
import { useScaleKey } from './utils'

export interface BindItem {
  note: number
  label: string
}

const FullScale = forwardRef((props, ref) => {
  const keyConfig = useSelector(selectKeyConfig)

  const { keyList, setKeyList, compositeConfig, setCompositeConfig } =
    useScaleKey(keyConfig, [
      { note: 72, label: '' },
      { note: 73, label: '' },
      { note: 74, label: '' },
      { note: 75, label: '' },
      { note: 76, label: '' },
      { note: 77, label: '' },
      { note: 78, label: '' },
      { note: 79, label: '' },
      { note: 80, label: '' },
      { note: 81, label: '' },
      { note: 82, label: '' },
      { note: 83, label: '' },
      { note: 84, label: '' },

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

      { note: 48, label: '' },
      { note: 49, label: '' },
      { note: 50, label: '' },
      { note: 51, label: '' },
      { note: 52, label: '' },
      { note: 53, label: '' },
      { note: 54, label: '' },
      { note: 55, label: '' },
      { note: 56, label: '' },
      { note: 57, label: '' },
      { note: 58, label: '' },
      { note: 59, label: '' }
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
    console.log(item, code, i)
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

  // 半音绑定
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
    <Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around'
          }}>
          {['', '1', '2', '3', '4', '5', '6', '7', 'i'].map((i, index) => (
            <div style={{ width: '100%', textAlign: 'center' }} key={index}>
              {i}
            </div>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IndicatorItem index={2} />
          {[0, 2, 4, 5, 7, 9, 11, 12].map((i) => (
            <KeyBind
              key={i}
              label={keyList[i].label}
              changeBind={(code: string) =>
                handleChangeBind(keyList[i], code, i)
              }
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IndicatorItem index={1} />
          {[13, 15, 17, 18, 20, 22, 24].map((i) => (
            <KeyBind
              key={i}
              label={keyList[i].label}
              changeBind={(code: string) =>
                handleChangeBind(keyList[i], code, i)
              }
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IndicatorItem index={0} />
          {[25, 27, 29, 30, 32, 34, 36].map((i) => (
            <KeyBind
              key={i}
              label={keyList[i].label}
              changeBind={(code: string) =>
                handleChangeBind(keyList[i], code, i)
              }
            />
          ))}
        </Box>
      </Box>
      {/*  */}
      <Box sx={{ display: 'flex' }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around'
            }}>
            {[' ', '1 ♯', '3 ♭', '4 ♯', '5 ♯', '7 ♭'].map((i, index) => (
              <div style={{ width: '100%', textAlign: 'center' }} key={index}>
                {i}
              </div>
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <IndicatorItem index={2} />
            {[1, 3, 6, 8, 10].map((i) => (
              <KeyBind
                key={i}
                label={keyList[i].label}
                changeBind={(code: string) =>
                  handleChangeBind(keyList[i], code, i)
                }
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <IndicatorItem index={1} />
            {[14, 16, 19, 21, 23].map((i) => (
              <KeyBind
                key={i}
                label={keyList[i].label}
                changeBind={(code: string) =>
                  handleChangeBind(keyList[i], code, i)
                }
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <IndicatorItem index={0} />
            {[26, 28, 31, 33, 35].map((i) => (
              <KeyBind
                key={i}
                label={keyList[i].label}
                changeBind={(code: string) =>
                  handleChangeBind(keyList[i], code, i)
                }
              />
            ))}
          </Box>
        </Box>
        <CompositeBind
          compositeConfig={compositeConfig}
          setCompositeConfig={setCompositeConfig}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <span>高半音</span>
            <KeyBind
              sx={{ mb: 0, ml: 1 }}
              label={compositeConfig.highSemitone}
              changeBind={(code: string) =>
                handleChangeSemitone('highSemitone', code)
              }
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>低半音</span>
            <KeyBind
              sx={{ mb: 0, ml: 1 }}
              label={compositeConfig.lowSemitone}
              changeBind={(code: string) =>
                handleChangeSemitone('lowSemitone', code)
              }
            />
          </Box>
        </CompositeBind>
      </Box>
    </Box>
  )
})

// 音符指示
const IndicatorItem = ({ index }: { index: number }) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        height: '20px',
        borderRadius: '50px',
        boxShadow: 'inset 0 0 0 1px #79715c',
        overflow: 'hidden',
        '&:first-of-type': {
          borderTopLeftRadius: '50px',
          borderBottomLeftRadius: '50px'
        },
        '&:last--of-type': {
          borderTopRightRadius: '50px',
          borderBottomRightRadius: '50px',
          borderRight: 0
        }
      }}>
      {[1, 2, 3].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: '20px',
            height: '20px',
            flexGrow: 1,
            borderRight: '1px solid #79715c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(i === index
              ? {
                  backgroundColor: '#d9c2a2',
                  borderColor: '#d9c2a2'
                  // '&::after': {
                  //   content: '"♪"',
                  //   display: 'inline-block',
                  //   color: '#333'
                  // }
                }
              : {})
          }}>
          {i === index && (
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12">
              <path d="M875.52 433.152q-7.168-1.024-12.8-10.24t-8.704-33.792q-5.12-39.936-26.112-58.88t-65.024-27.136q-46.08-9.216-81.408-37.376t-58.88-52.736q-22.528-21.504-34.816-15.36t-12.288 22.528l0 44.032 0 96.256q0 57.344-0.512 123.904t-0.512 125.952l0 104.448 0 58.368q1.024 24.576-7.68 54.784t-32.768 56.832-64 45.568-99.328 22.016q-60.416 3.072-109.056-21.504t-75.264-61.952-26.112-81.92 38.4-83.456 81.92-54.272 84.992-16.896 73.216 5.632 47.616 13.312l0-289.792q0-120.832 1.024-272.384 0-29.696 15.36-48.64t40.96-22.016q21.504-3.072 35.328 8.704t28.16 32.768 35.328 47.616 56.832 52.224q30.72 23.552 53.76 33.792t43.008 18.944 39.424 20.992 43.008 39.936q23.552 26.624 28.672 55.296t0.512 52.224-14.848 38.4-17.408 13.824z"></path>
            </svg>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default FullScale
