const isDebugMode = location.hostname.match(/localhost/)

console.log('Debug mode:', isDebugMode)
console.log('Version: 0.0.1')

if (!isDebugMode) {
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
}
