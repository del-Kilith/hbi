const Section_Dusk = [
  'This was meant to be a poem',
  'to explain how I feel,',
  'to explain the warmth',
  'that pervades my days,',
  'since you\'ve entered my life.',
  '$',
  'But that felt egocentric.-',
  'Making it all about me',
  'during your day.',
  '$',
  'Stupidly, I thought-',
  'a simple happy birthday,',
  'and some well wishes,',
  'would surely suffice.@',
  '$',
]
const Section_Night = [
  'But that felt reductive.-',
  'I don\'t want you to just',
  'be happy.-',
  '$',
  'I want you to be happy and I-',
  'want to be there to see it.',
  '$',
]
const Section_NightDeep = [
  'Our story might end with',
  'a bitter goodbye.-',
  '$',
  'Unspoken words.-',
  'Hurt feelings.-',
  '$',
  'It might fade with time.-',
  'Forgotten.-',
  'A piece of paper in the rain.@',
  '$',
  'But- I\'m willing to take the chance.@',
  '$',
]
const Section_Light = [
  'Many ideas have come and gone,',
  'and yet.',
  'I can\'t find the right words.-',
  'Words are just not enough.@',
  '$',
  'So here is my present for you.-',
  'The only thing I can think of',
  'that can express all of that.@',
  '$',
  'The only thing that is left',
  'within me,',
  'when I think of you.',
  '$',
  'Colors.',
]

const lines = [
  /*'Hey Irma@',
  '$',
  ...Section_Dusk,
  '*',
  ...Section_Night,
  '*',
  ...Section_NightDeep,
  '*',
  ...Section_Light,
  '*',
  '$',
  'Happy birthday Irma,-',
  'Alessandro',*/
  'Hello@',
  '$',
  'How are you?',
  '$',
  '*',
  'Colors are pretty huh?',
  '$',
  '*',
  'I know I know',
  '$',
  '*',
  'Enjoy them!',
  '$',
  '*',
  'Have a nice day!',
  '$',
];

async function prepareTyping(container, { before, after }) {
  await delay(before)
  container.classList.add('typing')
  const node = container.appendChild(document.createElement('p'))
  node.innerHTML = '&nbsp;'
  await delay(after)
  container.removeChild(node)
}

async function stopTyping(container, { before, after }) {
  await delay(before)
  container.classList.remove('typing')
  await delay(after)
}

(async function() {
  const wakeStatus = document.createElement('p')
  wakeStatus.style.position = 'absolute'
  wakeStatus.style.bottom = '1rem'
  wakeStatus.style.left = '1rem'
  isDebugMode && document.body.appendChild(wakeStatus)

  try {
    const wakeLock = await navigator.wakeLock.request('screen')
    wakeStatus.innerText = `Lock acquired: ${wakeLock.type}`
  } catch (err) {
    wakeStatus.innerText = `Lock failed: ${err.name} [${err.message}]`
    console.log(`${err.name}, ${err.message}`);
  }
  initialize(State.Day)

  const main = document.querySelector('main')
  initialize(State.Dusk)

  const sequence = [
    async () => await transition(State.Dusk, State.Night, 2000),
    async () => await transition(State.Night, State.NightDeep, 2000),
    async () => await transition(State.NightDeep, State.Light, 2000),
    async () => await transition(State.Light, State.Day, 4000),
  ][Symbol.iterator]()

  await prepareTyping(main, { before: 3000, after: 2000 })

  let sectionStartTime = Date.now()
  for (const line of lines) {
    const dbgline = line.replace('-','').replace('@', '')
    if (dbgline.length > 30) {
      console.warn(`Line is probably too long [${dbgline.length} chars]`, dbgline)
    }

    if (line === '$') {
      await stopTyping(main, { before: Delays.pause.breath, after: Delays.pause.long.max })
      await fadeText(main, Delays.pause.long.min)
      await prepareTyping(main, {before: Delays.pause.short.max, after: Delays.breath.min})
    } else if (line === '*') {
      console.log(`Section took ${(Date.now() - sectionStartTime) / 1000}s`)
      await sequence.next().value()
      sectionStartTime = Date.now()
    } else {
      const node = main.appendChild(document.createElement('p'))
      await type(node, line)
    }
    await delay(line.length <= 1 ? 'pause.short' : 'breath')
  }

  await stopTyping(main, Delays.pause.long.min)
  await fadeText(main, Delays.pause.long.min)
  await transition(State.Day, State.Loop0, 10000)

  const loop = [
    async () => await transition(State.Loop0, State.Loop1, 8000),
    async () => await transition(State.Loop1, State.Loop2, 8000),
    async () => await transition(State.Loop2, State.Loop3, 8000),
    async () => await transition(State.Loop3, State.Loop4, 8000),
    async () => await transition(State.Loop4, State.Loop5, 8000),
    async () => await transition(State.Loop5, State.Loop0, 8000),
  ]
  let i = 0
  while (true) {
    await loop[i++ % loop.length]()
  }
})();
