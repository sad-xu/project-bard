function debounce(fn: () => void, wait = 300) {
  let timeId: number | undefined
  return function (this: any, ...args: []) {
    clearTimeout(timeId)
    timeId = window.setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

// 黑白键区分
const BLACK_KEYS: { [k: number]: number } = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 }
const WHITE_KEYS: { [k: number]: number } = {
  0: 0,
  2: 1,
  4: 2,
  5: 3,
  7: 4,
  9: 5,
  11: 6
}

/** [按下时刻, 按下时长, 音符, 按键] */
type Mote = [number, number, number, string]

/**
 * 音游模式
 */
class MUG {
  wrapperEl: HTMLElement | null
  canvasEl: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  width: number
  height: number
  score: Mote[]
  scoreIndex: number
  isFullScale: boolean
  isPlay: boolean
  t: number
  lastT: number
  cb: () => void

  constructor(wrapperEl: HTMLElement) {
    // dom
    this.wrapperEl = null
    this.canvasEl = document.createElement('canvas')
    this.ctx = this.canvasEl.getContext('2d')
    // size
    this.width = 0
    this.height = 0
    // 乐谱
    this.score = []
    this.scoreIndex = 0 // 乐谱指针
    // 是否是全键盘
    this.isFullScale = true
    // 播放状态
    this.isPlay = false
    // 播放时间
    this.t = 0 // 持续时间
    this.lastT = 0 // 上一帧的时刻
    // 回调
    this.cb = () => {}
    this.init(wrapperEl)
  }

  init(wrapperEl: HTMLElement) {
    const that = this
    // 生成canvas元素 设置宽高
    wrapperEl.appendChild(this.canvasEl)
    this.wrapperEl = wrapperEl
    this.setWidthHeight()
    // 尺寸自适应
    window.addEventListener(
      'resize',
      debounce(function () {
        that.setWidthHeight()
      })
    )
  }

  /** 设置宽高 */
  setWidthHeight() {
    const { wrapperEl, canvasEl } = this
    if (wrapperEl) {
      const keyboardRect = document
        .getElementById('KeyboardContent')
        ?.getBoundingClientRect()
      if (keyboardRect) {
        wrapperEl.style.left = keyboardRect.left + 'px'
        wrapperEl.style.right = keyboardRect.left + 'px'
      }

      const width = wrapperEl.clientWidth
      const height = wrapperEl.clientHeight

      canvasEl.width = width
      canvasEl.height = height
      this.width = width
      this.height = height
    }
  }

  /**
   * 设置乐谱 是否是全键盘
   */
  setScore(score: Mote[], isFullScale: boolean) {
    this.score = score
    this.isFullScale = isFullScale
  }

  /**
   * 开始游戏
   * cb 正常播放完成的回调
   */
  play(cb: () => void) {
    if (!this.isPlay) {
      this.isPlay = true
      this.lastT = performance.now()
      this.cb = cb
      this.draw()
    }
  }

  /** 暂停 */
  stop() {
    if (this.isPlay) {
      this.isPlay = false
    }
  }

  /** 重玩 */
  replay(cb: () => void) {
    this.isPlay = false
    this.t = 0
    this.scoreIndex = 0
    this.play(cb)
  }

  /** 检测按键 */
  checkKey(note: number) {
    // * 音符触底暂停
    // * 检测最近x毫秒内按键，匹配正确后消失，若暂停，自动启动
  }

  /** draw */
  draw(time?: number) {
    // 首次循环 time === undefined
    const { ctx, width, height } = this
    if (!ctx) return
    if (time) {
      this.t += time - this.lastT
      this.lastT = time
    }
    const list: Mote[] = []
    const score = this.score
    const t = this.t
    for (let i = this.scoreIndex; i < score.length; i++) {
      const scoreTime = score[i][0]
      // 过去的
      if (scoreTime < t) {
        this.scoreIndex = i
      }
      // 现在及未来的
      if (scoreTime >= t - 500 && scoreTime < t + 3000) {
        list.push(score[i])
      }
    }

    ctx.shadowBlur = 4
    ctx.font = 'bolder 18px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.clearRect(0, 0, width, height)

    const isFullScale = this.isFullScale
    list.forEach((item) => {
      const pitch = item[2]
      let x
      let w
      // 黑白键区分
      const p = pitch % 12
      const isBlack = Boolean(BLACK_KEYS[p])

      const y = height - (height * (item[0] - t)) / 3000
      const h = Math.max((1 * item[1]) / 10, 20)

      if (isFullScale) {
        if (isBlack) {
          x =
            (width / 22) *
            (Math.floor((pitch - 48) / 12) * 7 + BLACK_KEYS[p] - 0.5)
          w = width * 0.04
          ctx.shadowColor = '#656060'
          ctx.fillStyle = '#333'
        } else {
          x = (width / 22) * (Math.floor((pitch - 48) / 12) * 7 + WHITE_KEYS[p])
          w = width / 22
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        }
      } else {
        if (isBlack) {
          x = (width / 8) * (BLACK_KEYS[p] - 0.32)
          w = width * 0.08
          ctx.shadowColor = '#656060'
          ctx.fillStyle = '#333'
        } else {
          x = (width / 8) * WHITE_KEYS[p]
          w = width / 8
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        }
      }

      this._drawRoundRect(ctx, x, y - h / 2, w, h, 10)
      // 按键显示
      if (item[3]) {
        if (isBlack) {
          ctx.shadowColor = '#333'
          ctx.fillStyle = '#e2e1e4'
        } else {
          ctx.shadowColor = '#e2e1e4'
          ctx.fillStyle = '#333'
        }
        if (pitch <= 59) {
          ctx.fillStyle = '#8092cf'
        } else if (pitch >= 72) {
          ctx.fillStyle = '#dd651b'
        }
        ctx.shadowBlur = 0
        ctx.fillText(item[3], x + w / 2, y)
      }
    })

    // over
    if (!list.length && this.scoreIndex !== 0) {
      this.stop()
      if (this.cb) this.cb()
    }
    if (this.isPlay) {
      requestAnimationFrame(this.draw.bind(this))
    }
  }

  /** 绘制圆角矩形  */
  _drawRoundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.fill()
  }
}

export default MUG
