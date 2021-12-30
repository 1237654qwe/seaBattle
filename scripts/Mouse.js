class Mouse {

  elem = null

  under = false
  prevUnder = false

  x = null
  y = null
  prevX = null
  prevY = null

  left = false
  prevLeft = false
  delta = 0
  prevDelta = 0

  constructor(elem) {
    this.elem = elem

    const common = (e) => {
      this.x = e.clientX
      this.y = e.clientY
      this.under = true
      this.delta = 0
    }

    elem.addEventListener("mousemove", (e) => {
      this.tick()
      common(e)
    })

    elem.addEventListener("mouseenter", (e) => {
      this.tick()
      common(e)

    })
    elem.addEventListener("mouseleave", (e) => {
      this.tick()
      common(e)
      this.under = false

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
    elem.addEventListener("wheel", (e) => {
      this.tick()
      common(e)

      this.x = e.clientX
      this.y = e.clientY
      this.delta = e.deltaY > 0 ? 1 : -1
      this.under = true

    })
  }
  tick() {
    this.prevX = this.x
    this.prevY = this.y
    this.prevUnder = this.under
    this.prevLeft = this.left
    this.prevDelta = this.delta
  }
}