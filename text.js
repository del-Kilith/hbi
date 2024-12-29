const Delays = {
  char: {
    min: 50,
    max: 100
  },
  pause: {
    short: {
      min: 400,
      max: 800
    },
    long: {
      min: 1000,
      max: 2000,
    }
  },
  breath: {
    min: 300,
    max: 500
  }
}

const TIME_SCALE_FACTOR = 1

async function delay(/* string | number */ pathOrTime = 0) {
  function sleep(/* number */ ms) {
    return new Promise(resolve => setTimeout(resolve, ms * TIME_SCALE_FACTOR))
  }

  function rand(/* { min: number, max: number } */ config) {
    return Math.random() * config.max + config.min
  }

  if (typeof pathOrTime === 'number') {
    return await sleep(pathOrTime)
  } else {
    const minMaxTime = pathOrTime.split('.').reduce((acc, cur) => acc[cur], Delays)
    return await sleep(rand(minMaxTime))
  }
}


async function type(
  /* HTMLElement */ container,
  /* string[] */ text
) {
  for (const char of text) {
    if (char === '@') {
      await delay('pause.long')
    } else if (char === '-') {
      await delay('pause.short')
    } else {
      container.textContent += char
    }
    await delay('char')
  }
}

async function fadeText(
  /* HTMLElement */ container,
  /* number */ duration
) {
  await container.animate([{ opacity: 0 }], { duration }).finished
  container.replaceChildren()
  container.style.opacity = '1'
}
