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
  extRadius: Math.random() * 30 + 20,//Math.max(screen.x, screen.y),
  spawnTime: Date.now(),
  ttl: Math.random() * 0.8 * 1000 + 4.2 * 1000,
  color: root.style.getPropertyValue('--rippleColor'),
  maxOpacity: root.style.getPropertyValue('--rippleMaxOpacity'),
  direction: Math.random() < 0.5 ? -1 : 1,
})
const ripples = []

const shine = () => ({
  spawnTime: Date.now(),
  maxExpansion: screen.x
})
const shines = []

const rippleSpeed = 200
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
  const o = Math.round(maxOpacity * Math.sin(Math.PI * t))
  const h = o.toString(16).padStart(2, '0')
  r.cx += rippleSpeed * r.direction * timeIncreasePerFrame

  ctx.fillStyle = `${color}${h}`
  ctx.beginPath()
  ctx.arc(r.cx, r.cy, radius, 0, Math.PI * 2, false)
  ctx.fill()
})

const renderShine = () => shines.forEach(shine => {
  const t = (Date.now() - shine.spawnTime) / 4
  const p = t / (screen.x * 2)
  const e = Math.round(shine.maxExpansion * Math.sin(Math.PI * p))
  const o = Math.round(17 * Math.sin(Math.PI * p * 2))

  if (e < 0) {
    shines.splice(shines.indexOf(shine), 1)
    return
  }


  ctx.lineWidth = e
  ctx.strokeStyle = `#ffffff${o.toString(16).padStart(2, '0')}`
  ctx.beginPath()
  ctx.moveTo(t, -200)
  ctx.lineTo(t - screen.x, screen.y * 2)
  ctx.stroke()
})

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  time += timeIncreasePerFrame
  renderShine()
  renderRipple()
  processSnow()
  renderSnow()
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

const spawnRipple = () => {
  ripples.push(ripple())
  //console.log('Ripple', ripples)
  setTimeout(spawnRipple, Math.floor(Math.random() * 1.5 * 1000))
}

setTimeout(spawnRipple, 1000)

const spawnShine = () => {
  shines.push(shine())
  console.log('Shine', shines)
  setTimeout(spawnShine, Math.floor(Math.random() * 15 * 1000 + 15 * 1000))
}
setTimeout(spawnShine, 1000)

