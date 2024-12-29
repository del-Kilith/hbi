const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const screen = { x: 0, y: 0 }

const resize = () => {
  canvas.width = screen.x = window.innerWidth
  canvas.height = screen.y = window.innerHeight
}
window.addEventListener('resize', resize)
resize() // Resize once to init the application

const snowflake_max_ttl = 110 * 1000
const snowflake_min_ttl =  10 * 1000

const snowflake = () => ({
  cx: Math.random() * screen.x,
  cy: Math.random() * screen.y,
  x: 0,
  y: 0,
  r: Math.random() * (12 - 5) + 5,
  xRandomFactor: Math.random() - 0.2,
  yRandomFactor: Math.random() + 0.5,
  oRandomFactor: Math.random() * 20 + 10,
  oRandomOffset: Math.random() * 2 * Math.PI,
  spawnTime: Date.now(),
  ttl: Math.round((Math.random() * snowflake_max_ttl) + snowflake_min_ttl),
})
let snow = new Array(180).fill(0).map(snowflake)

const ripple = () => ({
  cx: Math.random() * screen.x,
  cy: Math.random() * screen.y,
  extRadius: 50,//Math.max(screen.x, screen.y),
  spawnTime: Date.now(),
  ttl: Math.random() * 0.8 * 1000 + 4.2 * 1000,
  color: root.style.getPropertyValue('--rippleColor'),
  maxOpacity: root.style.getPropertyValue('--rippleMaxOpacity'),
})
const ripples = []

const snowTimeFactor = 1.5
const timeIncreasePerFrame = 0.001
let time = 0

const processSnow = () => {
  snow = snow.map(p => {
    if (Date.now() > p.spawnTime + p.ttl) {
      return snowflake()
    } else {
      return p
    }
  })
}

const renderSnow = () => snow.forEach(p => {
  p.x = p.cx + p.xRandomFactor * Math.cos(time * snowTimeFactor + p.oRandomOffset) * p.oRandomFactor
  p.y = p.cy + p.yRandomFactor * Math.sin(time * snowTimeFactor + p.oRandomOffset) * p.oRandomFactor

  // 34 -> 0 over snowflake.TTL
  const x = (Date.now() - p.spawnTime) / p.ttl
  const o = Math.floor(34 * Math.sin(Math.PI * x))
  const h = o.toString(16)

  ctx.fillStyle = `#ffffff${h.padStart(2, '0')}`
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false)
  ctx.fill()
})

const renderRipple = () => ripples.forEach(r => {
  const t = (Date.now() - r.spawnTime) / r.ttl
  const radius = r.extRadius * t

  if (radius >= r.extRadius) {
    ripples.splice(ripples.indexOf(r), 1)
    return
  }

  const maxOpacity = root.style.getPropertyValue('--rippleMaxOpacity')
  const color = root.style.getPropertyValue('--rippleColor')
  const o = Math.floor(maxOpacity * Math.sin(Math.PI * t))
  const h = o.toString(16).padStart(2, '0')

  ctx.fillStyle = `${color}${h}`
  ctx.beginPath()
  ctx.arc(r.cx, r.cy, radius, 0, Math.PI * 2, false)
  ctx.fill()
})

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  time += timeIncreasePerFrame
  renderRipple()
  processSnow()
  renderSnow()
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

const spawnRipple = () => {
  ripples.push(ripple())
  console.log('Ripple', ripples)
  setTimeout(spawnRipple, Math.floor(Math.random() * 1000))
}

setTimeout(spawnRipple, 1000)

