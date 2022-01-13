class Mouse {

  elem = null

  x = null
  y = null
  prevX = null
  prevY = null

  left = false
  prevLeft = false

  constructor(elem) {
    this.elem = elem

    const common = (e) => {
      this.x = e.clientX
      this.y = e.clientY
    }

    elem.addEventListener("mousemove", (e) => {
      this.tick()
      common(e)
    })

    elem.addEventListener("mousedown", (e) => {
      this.tick()
      common(e)
      if (e.which === 1) {
        this.left = true
      }
    })

    elem.addEventListener("mouseup", (e) => {
      this.tick()
      common(e)
      if (e.which === 1) {
        this.left = false
      }
    })

  }
  tick() {
    this.prevX = this.x
    this.prevY = this.y
    this.prevLeft = this.left
  }
}