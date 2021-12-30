const shipDatas = [
  { size: 4, direction: "row", startX: 10, startY: 390 },
  { size: 3, direction: "row", startX: 10, startY: 435 },
  { size: 3, direction: "row", startX: 130, startY: 435 },
  { size: 2, direction: "row", startX: 10, startY: 480 },
  { size: 2, direction: "row", startX: 88, startY: 480 },
  { size: 2, direction: "row", startX: 167, startY: 480 },
  { size: 1, direction: "row", startX: 10, startY: 525 },
  { size: 1, direction: "row", startX: 55, startY: 525 },
  { size: 1, direction: "row", startX: 100, startY: 525 },
  { size: 1, direction: "row", startX: 145, startY: 525 },
]

class PrepScene extends Scene {
  draggedShip = null
  draggedX = 0
  draggedY = 0

  init() {
    this.randomize = this.randomize.bind(this)
    this.manual = this.manual.bind(this)
    this.play = this.play.bind(this)

    this.manual()

  }

  start() {
    const {player, computer} = this.app
    computer.clear()
    player.clear()

    document
      .querySelectorAll(".button-actions")
      .forEach((element) => {
        element.classList.add('hidden')
      })

    document
    .querySelector('[data-scene="preparation"]')
    .classList.remove("hidden")

      const randomizeButton = document.querySelector('[data-action="randomize"]')
      randomizeButton.addEventListener('click', this.randomize)

      const manualButton = document.querySelector('[data-action="manual"]')
      manualButton.addEventListener('click', this.manual)

      const playButton = document.querySelector('[data-computer="play"]')
      playButton.addEventListener('click', this.play)
    }

  update() {

    document.onselectstart = function () {
      window.getSelection().removeAllRanges();
    };

    const { mouse, player } = this.app

		// Потенциально хотим начать тянуть корабль
		if (!this.draggedShip && mouse.left && !mouse.pLeft) {
			const ship = player.ships.find((ship) => ship.isUnder(mouse))

			if (ship) {
				const shipRect = ship.div.getBoundingClientRect()

				this.draggedShip = ship
				this.draggedOffsetX = mouse.x - shipRect.left
				this.draggedOffsetY = mouse.y - shipRect.top

				ship.x = null
				ship.y = null
			}
		}

    // Перетаскивание
		if (mouse.left && this.draggedShip) {
			const { left, top } = player.root.getBoundingClientRect()
			const x = mouse.x - left - this.draggedOffsetX
			const y = mouse.y - top - this.draggedOffsetY

			this.draggedShip.div.style.left = `${x}px`
			this.draggedShip.div.style.top = `${y}px`
		}

    // Бросание
		if (!mouse.left && this.draggedShip) {
			const ship = this.draggedShip
			this.draggedShip = null

			const { left, top } = ship.div.getBoundingClientRect()
			const { width, height } = player.cells[0][0].getBoundingClientRect()

			const point = {
				x: left + width / 2,
				y: top + height / 2,
			}

			const cell = player.cells
				.flat()
				.find((cell) => isUnderPoint(point, cell))

			if (cell) {
				const x = parseInt(cell.dataset.x)
				const y = parseInt(cell.dataset.y)

				player.removeShip(ship)
				player.addShip(ship, x, y)
			} else {
				player.removeShip(ship)
				player.addShip(ship)
			}
		}

    // Врощаение
		if (this.draggedShip && mouse.delta) {
			this.draggedShip.toggleDirection()
		}

    if (player.complete) {
      document.querySelector('[data-computer="play"]').disabled = false
    } else {
      document.querySelector('[data-computer="play"]').disabled = true
    }
  }

  randomize () {
    this.app.player.randomize(ShipView)

    for (let i = 0; i < 10; i++) {
      this.app.player.ships[i].startX = shipDatas[i].startX
      this.app.player.ships[i].startY = shipDatas[i].startY
    }
  }

  manual () {
    this.app.player.removeAllShips()

    for (const { size, direction, startX, startY } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY)
      this.app.player.addShip(ship)
    }
  }

  play () {
    const matrix = this.app.player.matrix
    const withoutShipItems = matrix.flat().filter((item) => !item.ship)
    let untouchables = []

    untouchables = getRandomShot(withoutShipItems, 30)
    this.app.start('computer', untouchables)

  }

}