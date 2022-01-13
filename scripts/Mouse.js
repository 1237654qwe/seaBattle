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

    elem.addEventListener("click", (e) => {
      this.tick()
      common(e)
      this.left = true
    })
  }
  
  tick() {
    this.prevX = this.x
    this.prevY = this.y
    this.left = false
    this.prevLeft = this.left
  }
}