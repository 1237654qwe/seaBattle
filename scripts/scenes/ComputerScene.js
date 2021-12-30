class ComputerScene extends Scene {
  untouchables = []
  playerTurn = true
  status = null

  init() {
    this.status = document.querySelector(".battlefield-status")
  }

  start(untouchables) {
    const { computer } = this.app

    document
      .querySelectorAll(".button-actions")
      .forEach((element) => {
        element.classList.add('hidden')
      })

    document
      .querySelector('[data-scene="computer"]')
      .classList.remove("hidden")

    computer.clear()
    computer.randomize(ShipView)

    this.untouchables = untouchables

  }

  update() {
    const { mouse, computer, player } = this.app

    const isEnd = computer.toLose || player.toLose

    const cells = computer.cells.flat()
    cells.forEach((cell) => cell.classList.remove('battlefield-item__active'))

    if (isEnd) {
      if (computer.toLose) {
        this.status.textContent = "Победа человека"
      } else {
        this.status.textContent = "Победа машины"
      }
      return
    }

    if (isUnderPoint(mouse, computer.table)) {
      const cell = cells.find(cell => isUnderPoint(mouse, cell))


      if (cell) {
        cell.classList.add('battlefield-item__active')

        //выстрел
        if (this.playerTurn && mouse.left && !mouse.prevLeft) {
          const x = parseInt(cell.dataset.x)
          const y = parseInt(cell.dataset.y)

          const shot = new ShotView(x, y)
          const result = computer.addShot(shot)

          if (result) {
            this.playerTurn = shot.variant === "miss" ? false : true
          }
        }
      }

      if (!this.playerTurn) {
        const x = getRandomBetween(0, 9)
        const y = getRandomBetween(0, 9)

        let inUntouchable = false

        for (const item of this.untouchables) {
          if (item.x === x && item.y === y) {
            inUntouchable = true
            break
          }
        }

        if (!inUntouchable) {
          const shot = new ShotView(x, y)
          const result = player.addShot(shot)

          if (result) {
            this.playerTurn = shot.variant === "miss" ? true : false
          }
        }
      }

      if (this.playerTurn) {
        this.status.textContent = "Ваш ход:"
      } else {
        this.status.textContent = "Ход комьютера:"
      }
    }
  }

  stop() {
    const { player, computer } = this.app
    computer.clear()
    player.clear()
  }
}