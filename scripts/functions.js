const getRandomBetween = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1))
}

const getRandomFrom = (...args) => {
  const index = Math.floor(Math.random() * args.length)
  return args[index]
}

const isUnderPoint = (point, element) => {
  const { left, top, width, height } = element.getBoundingClientRect()
  const { x, y } = point

  return (left <= x) && (x <= left + width) && (top <= y) && (y <= top + height)
}

const getRandomShot = (array = [], size = 1) => {
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

const getPositionsToMiss = (x, y, size, direction, form) => {
  const isCorner = form === 'corner'

  if (direction === 'column') {
    const arrayBySize = new Array(size).fill({})

    const rightPositionsToShoot = arrayBySize.map((item, i) => {
      if (isCorner) {
        return {
          x: x + 2,
          y: y + i,
        }
      }

      return {
        x: x + 1,
        y: y + i,
      }
    })

    if (isCorner && size === 2) {
      rightPositionsToShoot.push(
        { x: x + 2, y: y + 2 },
        { x: x + 1, y: y },
        { x: x + 2, y: y - 1 })
    }

    if (isCorner && size === 3) {
      rightPositionsToShoot.push(
        { x: x + 2, y: y + 3 },
        { x: x + 1, y: y },
        { x: x + 2, y: y - 1 },
        { x: x, y: y + 2 })
    }

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
      if (isCorner) {
        return {
          y: y + 2,
          x: x + i,
        }
      }

      return {
        y: y + 1,
        x: x + i,
      }
    })

    if (isCorner && size === 2) {
      rightPositionsToShoot.push(
        { y: y + 2, x: x + 2 },
        { y: y + 1, x: x },
        { y: y + 2, x: x - 1 })
    }

    if (isCorner && size === 3) {
      rightPositionsToShoot.push(
        { y: y + 2, x: x + 3 },
        { y: y + 1, x: x },
        { y: y + 2, x: x - 1 },
        { y: y, x: x + 2 })
    }


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

const dragAndDrop = (player) => {
  let ship

  const dragStart = (e) => {
    const id = e.target.dataset.id
    const curShip = player.ships.find((item) => item.id === Number(id))

    ship = curShip
  }

  const dragOver = (e) => {
    e.preventDefault()
  }

  const dragEnter = (e) => {
    e.preventDefault()
  }

  const dragDrop = (e) => {
    const targetCell = e.target

    if (targetCell) {
      const x = parseInt(targetCell.dataset.x)
      const y = parseInt(targetCell.dataset.y)

      player.removeShip(ship)
      player.addShip(ship, x, y)
    }
  }

  document.addEventListener('dragstart', dragStart)
  document.addEventListener('dragover', dragOver)
  document.addEventListener('dragenter', dragEnter)
  document.addEventListener('drop', dragDrop)
}

const rotate = (player, e) => {
    const id = e.target.dataset.id
    const curShip = player.ships.find((item) => item.id === Number(id))

    if (curShip.size === 1) {
      return
    }

    if (curShip.form === "ordinary") {
      const x = curShip.direction === 'row' ? curShip.x + 1 : curShip.x - 1
      const y = curShip.direction === 'row' ? curShip.y - 1 : curShip.y + 1

      const newShip = new ShipView(
        curShip.size,
        curShip.direction === 'row' ? 'column' : 'row',
        curShip.startX,
        curShip.startY,
        curShip.id,
        curShip.form
      )

      newShip.div.addEventListener('dblclick', (...args) => rotate(player, ...args))

      player.removeShip(curShip)
      player.addShip(newShip, x, y)
    } else {
      const x = curShip.direction === 'row' ? curShip.x : curShip.x
      const y = curShip.direction === 'row' ? curShip.y - 1 : curShip.y + 1

      const newShip = new ShipView(
        curShip.size,
        curShip.direction === 'row' ? 'column' : 'row',
        curShip.startX,
        curShip.startY,
        curShip.id,
        curShip.form
      )

      newShip.div.addEventListener('dblclick', (...args) => rotate(player, ...args))

      player.removeShip(curShip)
      player.addShip(newShip, x, y)
    }
  }

  const rotateShip = (ship, player) => {
    ship.addEventListener('dblclick', (...args) => rotate(player, ...args))
  }