import { useEffect, useState } from 'react'
import { KeyConfig } from 'store/bardSlice'
import { BindItem } from './FullScale'

export const useScaleKey = (
  keyConfig: KeyConfig,
  scaleKeyConfig: BindItem[]
) => {
  const [compositeConfig, setCompositeConfig] = useState({
    higher: '',
    lower: '',
    highSemitone: '',
    lowSemitone: ''
  })
  const [keyList, setKeyList] = useState<BindItem[]>(scaleKeyConfig)

  useEffect(() => {
    // 初始化已设置的按键
    let key: keyof typeof compositeConfig
    const copyed: any = {}
    for (key in compositeConfig) {
      copyed[key] = keyConfig[key]
    }
    setCompositeConfig(copyed)
    //
    const common = keyConfig.common
    let obj: any = {}
    for (let k in common) {
      obj[common[k]] = k as string
    }
    setKeyList(
      keyList.map((item) => ({
        note: item.note,
        label: obj[item.note] || ''
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyConfig])

  return {
    keyList,
    setKeyList,
    compositeConfig,
    setCompositeConfig
  }
}
