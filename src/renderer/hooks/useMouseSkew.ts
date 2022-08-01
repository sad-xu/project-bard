import { useEffect, useRef } from 'react'

// Tip: 注意用伪元素覆盖整面
// https://codepen.io/the_ruther4d/details/jbbwJa

/** 鼠标位置 XY 变化 hook */
const useMouseSkew = () => {
  const targetDom = useRef<HTMLElement>(null)

  useEffect(() => {
    const dom = targetDom.current
    let mouseLeaveHandler: any = null
    let mouseMoveHandler: any = null
    if (dom) {
      const mouseLeaveHandler = () => {
        dom.style.transform = ''
        dom.style.boxShadow = ''
      }
      const mouseMoveHandler = (e: MouseEvent) => {
        const t = +new Date()
        if (t - lastT > 200) {
          const { offsetX, offsetY } = e

          const w = dom.offsetWidth / 2
          const h = dom.offsetHeight / 2
          const posX = (h - offsetY) * (15 / h)
          const posY = (w - offsetX) * (20 / w) * -1

          dom.style.transform = `rotateX(${posX}deg) rotateY(${posY}deg) scale(1.1)`
          dom.style.boxShadow = `${-posY / 2}px ${
            posX / 2
          }px 10px 0 rgba(200,200,200,0.3)`
          lastT = t
        }
      }

      let lastT = +new Date()
      dom.style.transition = 'transform 0.2s'
      dom.addEventListener('mousemove', mouseMoveHandler)
      dom.addEventListener('mouseleave', mouseLeaveHandler)
    }
    return () => {
      if (dom) {
        dom.removeEventListener('mouseleave', mouseLeaveHandler)
        dom.removeEventListener('mousemove', mouseMoveHandler)
      }
    }
  }, [])

  return {
    targetDom
  }
}

export default useMouseSkew
