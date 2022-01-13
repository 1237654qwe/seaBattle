const shipDatas = [
  { size: 4, direction: "row", startX: 10, startY: 435, id: 1, form: "ordinary"  },
  { size: 3, direction: "row", startX: 10, startY: 480, id: 2, form: "ordinary" },
  { size: 3, direction: "row", startX: 130, startY: 480, id: 3, form: "ordinary" },
  { size: 2, direction: "row", startX: 10, startY: 525, id: 4, form: "ordinary" },
  { size: 2, direction: "row", startX: 88, startY: 525, id: 5, form: "ordinary" },
  { size: 2, direction: "row", startX: 167, startY: 525, id: 6, form: "ordinary" },
  { size: 1, direction: "row", startX: 10, startY: 570, id: 7, form: "ordinary" },
  { size: 1, direction: "row", startX: 55, startY: 570, id: 8, form: "ordinary" },
  { size: 1, direction: "row", startX: 100, startY: 570, id: 9, form: "ordinary" },
  { size: 1, direction: "row", startX: 145, startY: 570, id: 10, form: "ordinary" },
  { size: 3, direction: "row", startX: 250, startY: 435, id: 11, form: "corner" },
  { size: 2, direction: "row", startX: 250, startY: 525, id: 12, form: "corner" },
]

class PrepScene extends Scene {

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

    const { player } = this.app

    if (player.complete) {
      document.querySelector('[data-computer="play"]').disabled = false
    } else {
      document.querySelector('[data-computer="play"]').disabled = true
    }
  }

  randomize () {
    this.app.player.randomize(ShipView)

    for (let i = 0; i < 12; i++) {
      this.app.player.ships[i].startX = shipDatas[i].startX
      this.app.player.ships[i].startY = shipDatas[i].startY
    }
  }

  manual () {
    this.app.player.removeAllShips()

    for (const { size, direction, startX, startY, id, form } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY, id, form)
      this.app.player.addShip(ship)
      rotateShip(ship.div, this.app.player)
    }
    dragAndDrop(this.app.player)
  }

  play () {
    const matrix = this.app.player.matrix
    const withoutShipItems = matrix.flat().filter((item) => !item.ship)
    let untouchables = []

    untouchables = getRandomShot(withoutShipItems, 50)
    this.app.start('computer', untouchables)

  }

}