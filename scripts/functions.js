function getRandomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function getRandomFrom(...args) {
  const index = Math.floor(Math.random() * args.length)
  return args[index]
}

function isUnderPoint(point, element) {
  const { left, top, width, height } = element.getBoundingClientRect()
  const { x, y } = point

  return left <= x && x <= left + width && top <= y && y <= top + height
}

function getRandomShot(array = [], size = 1) {
  array = array.slice()

  if (size > array.length) {
    size = array.length
  }

  const result = []

  while (result.length < size) {
    const index = Math.floor(Math.random() * array.length)
    const item = array.splice(index, 1)[0]
    result.push(item)
  }

  return result
}

const getPositionsToMiss = (x, y, size, direction) => {
  if (direction === 'column') {
    const arrayBySize = new Array(size).fill({})

    const rightPositionsToShoot = arrayBySize.map((item, i) => {
      return {
        x: x + 1,
        y: y + i,
      }
    })

    const leftPositionsToShoot = arrayBySize.map((item, i) => {
      return {
        x: x - 1,
        y: y + i,
      }
    })

    const startPositionToShoot = [
      {
        x: x + 1,
        y: y - 1,
      },
      {
        x: x - 1,
        y: y - 1,
      },
      {
        y: y - 1,
        x,
      },
    ]

    const endPositionToShoot = [
      {
        x: x + 1,
        y: y + size,
      },
      {
        x: x - 1,
        y: y + size,
      },
      {
        y: y + size,
        x,
      },
    ]

    return [
      ...rightPositionsToShoot,
      ...leftPositionsToShoot,
      ...startPositionToShoot,
      ...endPositionToShoot,
    ]
  }

  if (direction === 'row') {
    const arrayBySize = new Array(size).fill({})

    const rightPositionsToShoot = arrayBySize.map((item, i) => {
      return {
        y: y + 1,
        x: x + i,
      }
    })

    const leftPositionsToShoot = arrayBySize.map((item, i) => {
      return {
        y: y - 1,
        x: x + i,
      }
    })

    const startPositionToShoot = [
      {
        y: y + 1,
        x: x - 1,
      },
      {
        y: y - 1,
        x: x - 1,
      },
      {
        x: x - 1,
        y,
      },
    ]

    const endPositionToShoot = [
      {
        y: y + 1,
        x: x + size,
      },
      {
        y: y - 1,
        x: x + size,
      },
      {
        x: x + size,
        y,
      },
    ]

    return [
      ...rightPositionsToShoot,
      ...leftPositionsToShoot,
      ...startPositionToShoot,
      ...endPositionToShoot,
    ]
  }

  return []
}