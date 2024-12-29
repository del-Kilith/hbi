const isDebugMode = location.hostname.match(/localhost/)

if (!isDebugMode) {
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
}