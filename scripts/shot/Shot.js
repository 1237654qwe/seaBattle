class Shot {

  x = null
  y = null
  variant = null

  constructor(x, y, variant = 'miss') {
    this.x = x
    this.y = y
    this.variant = variant
  }
  
  setVariant (variant) {
    this.variant = variant
  }
}