const State = {
  Dusk: {
    gradient: [
      'rgba(104,  76, 154, 1)',
      'rgba(166, 103, 171, 1)',
      'rgba(204, 125, 154, 1)', // 296 28.8 537
    ],
    text: 'black',
    rippleColor: '#AB678E',
    rippleMaxOpacity: 70,
    name: 'Dusk'
  },
  Night: {
    gradient: [
      'rgba( 30,  43,  88, 1)',
      'rgba( 37,  53, 105, 1)',
      'rgba( 53,  50, 131, 1)',
    ],
    text: '#e4dae5',
    rippleColor: '#255769',
    rippleMaxOpacity: 80,
    name: 'Night'
  },
  NightDeep: {
    gradient: [
      'rgb(0,8,32)',
      'rgb(0,8,32)',
      'rgb(0,8,32)',
    ],
    text: '#b1b1b1',
    rippleColor: '#080020',
    rippleMaxOpacity: 150,
    name: 'Night Deep'
  },
  Light: {
    gradient: [
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 1)'
    ],
    text: 'black',
    rippleColor: '#FFFFFF',
    rippleMaxOpacity: 0,
    name: 'Light'
  },
  Day: {
    gradient: [
      '#FFA5D5', // 'hsl(328, 100, 92.4)',
      '#FFAFAF', // 'hsl(  0, 100, 94.3)',
      '#FFD79F', // 'hsl( 35, 100, 81.2)',
    ],
    rippleColor: '#FFD7AF',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Day'
  }
}

const root = document.querySelector(':root')

/**
 * Sets the [t00, t05, t10] properties in the root node
 * @param gradient an array of length three of valid color string
 */
function setRootGradient(gradient) {
  root.style.setProperty('--t00', gradient[0])
  root.style.setProperty('--t05', gradient[1])
  root.style.setProperty('--t10', gradient[2])
}

/**
 * Initializes the state of the application
 * @param state the initial state
 */
function initialize(state) {
  setRootGradient(state.gradient)
  root.style.setProperty('--txt', state.text)
  root.style.setProperty('--rippleColor', state.rippleColor)
  root.style.setProperty('--rippleMaxOpacity', state.rippleMaxOpacity)
}

/**
 * Transitions from one state to another over a set period of time
 * @param from the state to transition from
 * @param to the state to transition to
 * @param duration transition duration in milliseconds
 */
function transition(from, to, duration) {
  console.groupCollapsed(`Transition ${from.name} to ${to.name}`)
  console.log(`Going from ${from.rippleMaxOpacity} to ${to.rippleMaxOpacity} in ${duration}ms`)
  let frame = 0
  return new Promise(resolve => {
    const finishTransition = () => {
      initialize(to)
      console.groupEnd()
      resolve()
    }

    const startTime = Date.now()
    const loop = () => {
      console.groupCollapsed(`Frame ${frame++}`)
      const elapsed = Date.now() - startTime
      const percent = elapsed / duration
      console.log(`At ${elapsed}ms of ${duration} [${percent}% of total]`)

      const gradient = [0, 1, 2].map(row => getColorAtPercent(row, percent))
      setRootGradient(gradient)
      console.log('Updated gradient to', gradient)

      const maxOpacity = from.rippleMaxOpacity + (to.rippleMaxOpacity - from.rippleMaxOpacity) / duration * elapsed
      root.style.setProperty('--rippleMaxOpacity', `${maxOpacity}`)
      console.log('Updated max opacity to', maxOpacity)

      const color = getColorAtPercent(3, percent)
      root.style.setProperty('--rippleColor', color)

      if (elapsed < duration) {
        requestAnimationFrame(loop)
      } else {
        finishTransition()
      }
      console.groupEnd()
    }

    updateGradientGuideline(from, to)
    requestAnimationFrame(loop)
  })
}
