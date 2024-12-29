const timer = document.createElement('p')
timer.style.position = 'absolute'
timer.style.top = '1rem'
timer.style.left = '1rem'
document.body.appendChild(timer)

/**
 * Not a reliable way to get the time,
 * used only for debug purposes
 * @type {number}
 */
let secondsSinceStart = 0

const timeFunction = () => {
  timer.innerText = `${secondsSinceStart++}s`
  setTimeout(timeFunction, 1000)
}
setTimeout(timeFunction, 1000)
