import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel
} from '@mui/material'
import FullScale from './components/FullScale'
import PartScale from './components/PartScale'
import { useState, useRef, useEffect } from 'react'
import CustomDialogTitle from '../../components/CustomDialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import { KeyConfig, selectKeyConfig, setKeyConfig } from '../../store/bardSlice'
// import { saveKeyConfig } from 'api/user'

interface KeyboardMenuProps {
  keyboardMenuOpen: boolean
  toggleKeyboardMenu: (flag: boolean) => void
}

/** 按键设置 */
const KeyboardMenu = ({
  keyboardMenuOpen,
  toggleKeyboardMenu
}: KeyboardMenuProps) => {
  const dispatch = useDispatch()
  const keyConfig = useSelector(selectKeyConfig)

  const [keyConfigCloned, setKeyConfigCloned] = useState<KeyConfig>(keyConfig)
  const { isFullScale } = keyConfigCloned
  const scaleRef = useRef<{ getScaleKeys: () => Partial<KeyConfig> }>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (keyboardMenuOpen) {
      setKeyConfigCloned(JSON.parse(JSON.stringify(keyConfig)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardMenuOpen])

  /** 修改克隆配置 */
  const handleSetKeyConfigCloned = (obj: Partial<KeyConfig>) => {
    setKeyConfigCloned({
      ...keyConfigCloned,
      ...obj
    })
  }

  /** 保存 */
  const handleSave = () => {
    toggleKeyboardMenu(false)
    // 先对比，再同步克隆配置到真实配置
    const newKeyConfig = checkIsChanged()
    if (newKeyConfig) {
      // saveKeyConfig(newKeyConfig)
      dispatch(setKeyConfig(newKeyConfig))
    }
  }

  /** 关闭 */
  const handleClose = () => {
    const newKeyConfig = checkIsChanged()
    if (newKeyConfig) {
      // 有改动，弹出确认框
      setOpen(true)
    } else toggleKeyboardMenu(false)
  }

  /** 正式关闭 */
  const handleTruthclose = () => {
    setOpen(false)
    toggleKeyboardMenu(false)
  }

  /** 验证是否有修改 */
  const checkIsChanged = () => {
    const newKeyConfig = {
      isFullScale: isFullScale,
      ...scaleRef?.current?.getScaleKeys() // 获取子组件配置 useImperativeHandle
    } as KeyConfig
    let key: keyof KeyConfig
    for (key in newKeyConfig) {
      if (key === 'common') {
        const commonObj = keyConfig[key]
        const newCommonObj = newKeyConfig[key]
        if (Object.keys(commonObj).length !== Object.keys(newCommonObj).length)
          return newKeyConfig
        for (let k in newCommonObj) {
          if (commonObj[k] !== newCommonObj[k]) return newKeyConfig
        }
      } else {
        if (newKeyConfig[key] !== keyConfig[key]) {
          return newKeyConfig
        }
      }
    }
    return false
  }

  /** 切换全音阶 */
  const handelToggleFullScall = () => {
    handleSetKeyConfigCloned({
      isFullScale: !isFullScale
    })
  }

  return (
    <Dialog open={keyboardMenuOpen} onClose={handleClose}>
      <CustomDialogTitle onClose={handleClose}>
        乐器演奏操作设置
      </CustomDialogTitle>
      <DialogContent dividers>
        <FormControlLabel
          control={
            <Checkbox checked={isFullScale} onChange={handelToggleFullScall} />
          }
          label="全音阶一同显示、设置按键"
        />
        {isFullScale ? (
          <FullScale ref={scaleRef} />
        ) : (
          <PartScale ref={scaleRef} />
        )}
        {/* 离开确认 */}
        <Dialog open={open} onClose={handleTruthclose}>
          <DialogContent>还有改动没有保存，确认关闭嘛</DialogContent>
          <DialogActions>
            <Button onClick={handleTruthclose}>确认</Button>
            <Button onClick={() => setOpen(false)}>取消</Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'space-between'
        }}>
        <Box
          sx={{
            fontSize: '14px'
          }}>
          请选择要设定的音阶，鼠标右键单击可解除设定。
        </Box>
        <Box>
          <Button variant="contained" onClick={handleSave}>
            应用
          </Button>
          <Button onClick={handleClose}>关闭</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default KeyboardMenu
