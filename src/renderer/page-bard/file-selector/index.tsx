import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'

const FileSelector = () => {
  const [currentFiles, setCurrentFiles] = useState<string[]>([])
  const [renderTime, setRenderTime] = useState(0)

  useEffect(() => {
    console.log('iiii')
    window.electron.ipcRenderer.on('ipc-file-path', (arg) => {
      console.log(arg)
      setCurrentFiles(arg as string[])
      setRenderTime((n) => n + 1)
    })
  }, [])

  const getTargetFiles = () => {
    window.electron.ipcRenderer.sendMessage('ipc-file-path', '/path')
    // for (let filename of file) {
    //   const stat = fs.statSync(path.join(filepath, filename))
    //   if (stat.isFile()) {
    //     if (path.extname(filename).toLowerCase() === '.md') {
    //       this.tableData.push({
    //         filename: filename,
    //         filesize: stat.size
    //       })
  }

  const handleFileChange = (e: any) => {
    console.log(e)
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = (evt) => {
        // this.$emit('parse-upload-file', file.name, evt.target.result)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0
      }}>
      <Button onClick={getTargetFiles}>111</Button>
      {renderTime}
      <input
        id="FileInput"
        type="file"
        accept=".mid"
        onChange={handleFileChange}
      />
      <Box>
        {currentFiles.map((file, i) => (
          <Box key={i}>{file}</Box>
        ))}
      </Box>
    </Box>
  )
}

export default FileSelector
