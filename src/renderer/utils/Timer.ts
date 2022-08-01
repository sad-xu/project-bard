/** worker 状态 */
export enum Status {
  Free,
  Running,
  Stop
}

/**
 * 高精度计时器
 *
 */

class Timer {
  worker: null | Worker
  interval: number
  status: Status

  constructor() {
    this.worker = null
    // 计时器间隔时间
    this.interval = 0
    // 运行状态
    this.status = Status.Free
  }

  init(cb: () => void, interval: number = 20) {
    this.interval = interval
    this.worker = new Worker('/worker.js')
    this.worker.onmessage = cb
  }

  start() {
    if (this.status === Status.Stop || this.status === Status.Free) {
      this.status = Status.Running
      this.worker?.postMessage({
        cmd: 'start',
        option: { interval: this.interval }
      })
    }
  }

  stop() {
    if (this.status === Status.Running) {
      this.status = Status.Stop
      this.worker?.postMessage({
        cmd: 'stop'
      })
    }
  }

  end() {
    this.status = Status.Free
    // worker 一旦终止，无法重用
    this.worker?.terminate()
  }
}

export default new Timer()
