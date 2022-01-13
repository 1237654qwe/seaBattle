class Battlefield {
  ships = []
  shots = []

  #matrix = null
  #changed = true

  constructor() {

  }

  get toLose() {
    for (const ship of this.ships) {
      if (!ship.killed) {
        return false
      }
    }
    return true
  }

  get matrix() {
    if (!this.#changed) {
      this.#matrix
    }

    const matrix = []

    for (let y = 0; y < 12; y++) {
      const row = []

      for (let x = 0; x < 12; x++) {
        const item = {
          x,
          y,
          ship: null,
          free: true,
          wounded: false,
          shoted: false
        }

        row.push(item)
      }

      matrix.push(row)
    }

    for (const ship of this.ships) {
      if (!ship.placed) {
        continue
      }

      const { x, y } = ship

      const dx = ship.direction === 'row'
      const dy = ship.direction === 'column'
      let curFormY = 0
      let curFormX= 0

      if (ship.form === 'ordinary') {
        curFormY = 1
        curFormX = 1
      } else if (ship.form === 'corner' && ship.direction === "row") {
        curFormY = 2
        curFormX = 0
      } else if (ship.form === 'corner' && ship.direction === "column") {
        curFormY = 1
        curFormX = 2
      }

      if (ship.form === 'ordinary') {
        for (let i = 0; i < ship.size; i++) {
          const cx = x + dx * i
          const cy = y + dy * i

          const item = matrix[cy][cx]
          item.ship = ship
        }
      } else if (ship.size === 3 && ship.form === 'corner') {
        for (let a = 0; a < 2; a++) {
          const cx = x + dx * a
          const cy = y + dy * a

          const item = matrix[cy][cx]
          item.ship = ship  
        }

        for (let b = 0; b < 2; b++) {
          const cx = (x + 1) + dx * b
          const cy = (y + 1) + dy * b

          const item = matrix[cy][cx]
          item.ship = ship
        }
      } else if (ship.size === 2 && ship.form === 'corner') {
        for (let a = 0; a < 2; a++) {
          const cx = x + dx * a
          const cy = y + dy * a

          const item = matrix[cy][cx]
          item.ship = ship
        }

        for (let b = 0; b < 1; b++) {
          const cx = (x + 1) + dx * b
          const cy = (y + 1) + dy * b

          const item = matrix[cy][cx]
          item.ship = ship
        }
      }




      for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + curFormY; y++) {
        for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + curFormX; x++) {
          if (this.inField(x, y)) {
            const item = matrix[y][x]
            item.free = false
          }
        }
      }
    }

    for (const { x, y } of this.shots) {
      const item = matrix[y][x]
      item.shoted = true

      if (item.ship) {
        item.wounded = true
      }
    }

   
    this.#matrix = matrix
    this.#changed = false

    return this.#matrix
  }

  get complete() {
    if (this.ships.length !== 12) {
      return false
    }

    for (const ship of this.ships) {
      if (!ship.placed) {
        return false
      }
    }
    return true
  }

  inField(x, y) {
    const isNumber = (n) =>
      parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);



    if (!isNumber(x) || !isNumber(y)) {
      return false
    }

    return 0 <= x && x < 12 && 0 <= y && y < 12
  }

  addShip(ship, x, y) {
    if (this.ships.includes(ship)) {
      return false
    }

    this.ships.push(ship)

    if (this.inField(x, y)) {
      const dx = ship.direction === "row"
      const dy = ship.direction === "column"

      let placed = true

      for (let i = 0; i < ship.size; i++) {
        if (ship.form === 'ordinary') {
          const cx = x + dx * i
          const cy = y + dy * i

          if (!this.inField(cx, cy)) {
            placed = false
            break
          }

          const item = this.matrix[cy][cx]

          if (!item.free) {
            placed = false
            break
          }

        } else {
          const cx = x + dx * i
          const cy = (y + 1) + dy * i
          const cyCorner = y + dy * i

          if (!this.inField(cx, cy)) {
            placed = false
            break
          }

          const item = this.matrix[cy][cx]

          if (!item.free) {
            placed = false
            break
          }

          const item2 = this.matrix[cyCorner][cx]
          
          if (!item2.free) {
            placed = false
            break
          }
        }
      }

      if (placed) {
        Object.assign(ship, { x, y })
      }
    }

    // console.log(this.matrix)
    this.#changed = true
    return true
  }

  removeShip(ship) {
    if (!this.ships.includes(ship)) {
      return false
    }

    const index = this.ships.indexOf(ship)
    this.ships.splice(index, 1)

    ship.x = null
    ship.y = null

    this.#changed = true
    return true
  }

  removeAllShips() {
    const ships = this.ships.slice()

    for (const ship of ships) {
      this.removeShip(ship)
    }

    return ships.length
  }

  addShot(shot) {
    for (const { x, y } of this.shots) {
      if (x === shot.x && y === shot.y) {
        return false
      }
    }

    this.shots.push(shot)
    this.#changed = true

    const matrix = this.matrix
    const { x, y } = shot

    if (matrix[y][x].ship) {
      shot.setVariant("wounded")

      const { ship } = matrix[y][x]
      const dx = ship.direction === "row"
      const dy = ship.direction === "column"

      let killed = true

      if (ship.form === 'ordinary') {
        for (let i = 0; i < ship.size; i++) {
          const cx = ship.x + dx * i
          const cy = ship.y + dy * i
          const item = matrix[cy][cx]

          if (!item.wounded) {
            killed = false
            break
          }
        }
      } else if (ship.size === 3 && ship.form === 'corner') {
        for (let a = 0; a < 2; a++) {
          const cx = ship.x + dx * a
          const cy = ship.y + dy * a

          const item = matrix[cy][cx]
          
          if (!item.wounded) {
            killed = false
            break
          }
        }

        for (let b = 0; b < 2; b++) {
          const cx = (ship.x + 1) + dx * b
          const cy = (ship.y + 1) + dy * b

          const item = matrix[cy][cx]
          
          if (!item.wounded) {
            killed = false
            break
          }
        }
      } else if (ship.size === 2 && ship.form === 'corner') {
        for (let a = 0; a < 2; a++) {
          const cx = ship.x + dx * a
          const cy = ship.y + dy * a

          const item = matrix[cy][cx]
          
          if (!item.wounded) {
            killed = false
            break
          }
        }

        for (let b = 0; b < 1; b++) {
          const cx = (ship.x + 1) + dx * b
          const cy = (ship.y + 1) + dy * b

          const item = matrix[cy][cx]
          
          if (!item.wounded) {
            killed = false
            break
          }
        }
      }


      if (killed) {
        ship.killed = true


        if (ship.form === 'ordinary') {
          for (let i = 0; i < ship.size; i++) {
            const cx = ship.x + dx * i
            const cy = ship.y + dy * i

            const shot = this.shots.find(
              (shot) => shot.x === cx && shot.y === cy
            )

            shot.setVariant("killed", false, ship)

            const arr = getPositionsToMiss(ship.x, ship.y, ship.size, ship.direction, ship.form)
            arr.map(item => {
              let correctX = item.x
              let correctY = item.y

              if (item.x < 0) {
                correctX = 0
              }

              if (item.x > 11) {
                correctX = 11
              }

              if (item.y < 0) {
                correctY = 0
              }

              if (item.y > 11) {
                correctY = 11
              }

              const newShot = new ShotView(correctX, correctY)
              this.addShot(newShot)

            })
          }
        } else if (ship.size === 3 && ship.form === 'corner') {
          for (let a = 0; a < 2; a++) {
            const cx = ship.x + dx * a
            const cy = ship.y + dy * a

            const shot = this.shots.find(
              (shot) => shot.x === cx && shot.y === cy
            )

            shot.setVariant("killed", false, ship)

            const arr = getPositionsToMiss(ship.x, ship.y, ship.size, ship.direction, ship.form)
            arr.map(item => {
              let correctX = item.x
              let correctY = item.y

              if (item.x < 0) {
                correctX = 0
              }

              if (item.x > 11) {
                correctX = 11
              }

              if (item.y < 0) {
                correctY = 0
              }

              if (item.y > 11) {
                correctY = 11
              }

              const newShot = new ShotView(correctX, correctY)
              this.addShot(newShot)

            })
          }

          for (let b = 0; b < 2; b++) {
            const cx = (ship.x + 1) + dx * b
            const cy = (ship.y + 1) + dy * b

            const shot = this.shots.find(
              (shot) => shot.x === cx && shot.y === cy
            )

            shot.setVariant("killed", false, ship)

            const arr = getPositionsToMiss(ship.x, ship.y, ship.size, ship.direction, ship.form)
            arr.map(item => {
              let correctX = item.x
              let correctY = item.y

              if (item.x < 0) {
                correctX = 0
              }

              if (item.x > 11) {
                correctX = 11
              }

              if (item.y < 0) {
                correctY = 0
              }

              if (item.y > 11) {
                correctY = 11
              }

              const newShot = new ShotView(correctX, correctY)
              this.addShot(newShot)

            })
          }
        } else if (ship.size === 2 && ship.form === 'corner') {
          for (let a = 0; a < 2; a++) {
            const cx = ship.x + dx * a
            const cy = ship.y + dy * a

            const shot = this.shots.find(
              (shot) => shot.x === cx && shot.y === cy
            )

            shot.setVariant("killed", false, ship)

            const arr = getPositionsToMiss(ship.x, ship.y, ship.size, ship.direction, ship.form)
            arr.map(item => {
              let correctX = item.x
              let correctY = item.y

              if (item.x < 0) {
                correctX = 0
              }

              if (item.x > 11) {
                correctX = 11
              }

              if (item.y < 0) {
                correctY = 0
              }

              if (item.y > 11) {
                correctY = 11
              }

              const newShot = new ShotView(correctX, correctY)
              this.addShot(newShot)

            })
          }

          for (let b = 0; b < 1; b++) {
            const cx = (ship.x + 1) + dx * b
            const cy = (ship.y + 1) + dy * b

            const shot = this.shots.find(
              (shot) => shot.x === cx && shot.y === cy
            )

            shot.setVariant("killed", false, ship)

            const arr = getPositionsToMiss(ship.x, ship.y, ship.size, ship.direction, ship.form)
            arr.map(item => {
              let correctX = item.x
              let correctY = item.y

              if (item.x < 0) {
                correctX = 0
              }

              if (item.x > 11) {
                correctX = 0
              }

              if (item.y < 0) {
                correctY = 0
              }

              if (item.y > 11) {
                correctY = 0
              }

              const newShot = new ShotView(correctX, correctY)
              this.addShot(newShot)

            })
          }
        }
      }
    }

    this.#changed = true
    return true
  }

  removeShot(shot) {
    if (this.shots.includes(shot)) {
      return false
    }

    const index = this.shots.indexOf(shot)
    this.shots.splice(index, 1)

    this.#changed = true
    return true
  }

  removeAllShots() {
    const shots = this.shots.slice()

    for (const shot of shots) {
      this.removeShot(shot)
    }

    this.#changed = true
    return true
  }

  randomize() {
    this.removeAllShips()

   for(let i = 0; i < 12; i++ ) {
     const item = shipDatas[i]
     const directon = getRandomFrom("row", "column")
     const ship = new ShipView(item.size, directon, null, null, item.id, item.form)

      while (!ship.placed) {
        const x = getRandomBetween(0, 11)
        const y = getRandomBetween(0, 11)

        this.removeShip(ship)
        this.addShip(ship, x, y)
      }
   }

  }

  clear() {
    this.removeAllShips()
    this.removeAllShots()
  }
}