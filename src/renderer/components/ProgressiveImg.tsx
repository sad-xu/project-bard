import { Box, styled } from '@mui/material'
import { useEffect, useRef } from 'react'

interface ProgressiveImgProps {
  url: string
  height: string
}

const IS_SUPPORT = window.IntersectionObserver
const io =
  IS_SUPPORT &&
  new window.IntersectionObserver(
    (enteries) => {
      enteries.forEach((e) => {
        const el = e.target as HTMLElement
        el.style.backgroundImage = `url(${e.target.getAttribute('data-img')})`
        el.style.filter = 'none'
        io && io.unobserve(el)
      })
    },
    {
      threshold: [0.75]
    }
  )

// 渐进式图片加载
const ProgressiveImg = ({ url, height = '140' }: ProgressiveImgProps) => {
  const originUrl = `${url}?imageMogr2/thumbnail/x${height}`
  const packedUrl = IS_SUPPORT ? `${url}?imageMogr2/thumbnail/x14` : originUrl

  const imgRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const imgEl = imgRef.current as HTMLElement
    // 不支持特性时，使用大图 & 取消模糊
    if (!IS_SUPPORT) {
      imgEl.style.filter = 'none'
    }
    // 添加监听
    io && io.observe(imgEl)
    // 取消监听
    return () => {
      io && io.unobserve(imgEl)
    }
  }, [])

  return (
    <ImgBox
      ref={imgRef}
      data-img={originUrl}
      sx={{
        backgroundImage: `url(${packedUrl})`,
        height: `${height}px`
      }}
    />
  )
}

const ImgBox = styled(Box)({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(10px)',
  transition: 'filter 0.3s'
})

export default ProgressiveImg
