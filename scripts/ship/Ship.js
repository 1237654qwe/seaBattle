class Ship {
  size = null
  direction = null
  id = null
  form = null
  killed = false

  x = null
  y = null

  get placed() {
    return (this.x !== null) && (this.y !== null)
  }

  constructor(size, direction, id, form) {
    this.size = size
    this.direction = direction
    this.id = id
    this.form = form
  }
}