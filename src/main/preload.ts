import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels = 'ipc-file-path'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: any) {
      ipcRenderer.send(channel, args)
    },
    on(channel: Channels, func: (...args: any) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)

      return () => ipcRenderer.removeListener(channel, subscription)
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    }
  }
})
