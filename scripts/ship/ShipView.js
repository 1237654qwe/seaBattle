class ShipView extends Ship {

  div = null

  startX = null
  startY = null

  constructor(size, direction, startX, startY, id, form) {
		super(size, direction, id, form)

		const div = document.createElement("div")
		div.classList.add("ship")
		div.setAttribute('draggable', 'true')
		div.setAttribute('size', `${this.size}`)
		div.setAttribute('data-id', `${id}`)
		div.setAttribute('form', `${form}`)


		Object.assign(this, { div, startX, startY, id, form })

		this.setDirection(direction, true)
	}

  setDirection(newDirection, force = false) {
		if (!force && this.direction === newDirection) {
			return false
		}

		if (this.form === "ordinary") {
			this.div.classList.remove(`ship-${this.direction}-${this.size}`)
			this.direction = newDirection
			this.div.classList.add(`ship-${this.direction}-${this.size}`)
		} else {
			this.div.classList.remove(`ship-${this.direction}-${this.size}-${this.form}`)
			this.direction = newDirection
			this.div.classList.add(`ship-${this.direction}-${this.size}-${this.form}`)
		}

		return true
	}

  toggleDirection() {
		const newDirection = this.direction === "row" ? "column" : "row"
		this.setDirection(newDirection)
	}

	isUnder(point) {
		return isUnderPoint(point, this.div)
	}


}