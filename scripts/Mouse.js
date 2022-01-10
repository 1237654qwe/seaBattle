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
  right = false
  prevRight = false

  constructor(elem) {
    this.elem = elem

    const common = (e) => {
      this.x = e.clientX
      this.y = e.clientY
      this.under = true
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
      } else if (e.which === 3) {
        this.right = true
      }

    })
    elem.addEventListener("mouseup", (e) => {
      this.tick()
      common(e)
      if (e.which === 1) {
        this.left = false
      } else if (e.which === 3) {
        this.right = false
      }
    })

  }
  tick() {
    this.prevX = this.x
    this.prevY = this.y
    this.prevUnder = this.under
    this.prevLeft = this.left
    this.prevRight = this.right
    this.right = false
  }
}