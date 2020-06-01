import Matrix from "./Matrix"
//@ts-ignore
import p5 from "p5";

export default class Nucleotide {

  public image: p5.Image
  public color: p5.Color
  public colorName: string
  public isWall: boolean = false

  constructor(
    public matrix:Matrix,
    public gridPosition:p5.Vector
  ) {
    const colors = Object.keys(matrix.app.images.nucleotides)
    this.colorName = colors[Math.floor(Math.random()*colors.length)]
    this.image = matrix.app.images.nucleotides[this.colorName]
    switch (this.colorName) {
      case 'blue': this.color = this.p.color(0,0,255); break
      case 'red': this.color = this.p.color(255,0,0); break
      case 'yellow': this.color = this.p.color(255,255,0); break
      case 'green': this.color = this.p.color(0,255,0); break
    }
  }

  get p(): p5 {
    return this.matrix.p
  }

  get flatTopped(): boolean {
    return this.matrix.flatTopped
  }

  get radius(): number {
    return this.matrix.nucleotideRadius
  }

  get width(): number {
    return !this.flatTopped ? this.p.sqrt(3) * this.radius : 2 * this.radius
  }

  get height(): number {
    return !this.flatTopped ? 2 * this.radius : this.p.sqrt(3) * this.radius
  }

  get dist(): p5.Vector {
    const
      width = this.width,
      height = this.height
    return this.p.createVector(
      this.flatTopped ? width * (3 / 4) : width,
      this.flatTopped ? height : height * (3 / 4)
    )
  }

  get x(): number {
    const width = this.width
    return this.flatTopped ?
      (width / 2 + this.gridPosition.x * this.dist.x) :
      (this.gridPosition.x * width - width / 2) +
      (this.gridPosition.y % 2 === 0 ? width / 2 : 0) + width
  }

  get y(): number {
    const height = this.height
    return this.flatTopped ?
      (this.gridPosition.y * height - height / 2) +
      (this.gridPosition.x % 2 === 0 ? height / 2 : 0) + height :
      (height / 2 + this.gridPosition.y * this.dist.y)
  }

  get screenPosition(): p5.Vector {
    return this.p.createVector(this.x, this.y)
  }

  hovered(): boolean {
    const pos = this.screenPosition
    return this.p.dist(
      pos.x,pos.y,
      this.p.mouseX,this.p.mouseY
    ) < this.radius * 0.9
  }

  isNeighborOf(nucleotide: Nucleotide ): boolean {
    const
      x1 = this.gridPosition.x,
      y1 = this.gridPosition.y,
      x2 = nucleotide.gridPosition.x,
      y2 = nucleotide.gridPosition.y
    return this.gridPosition.x % 2 === 0 ? (
      (x2 === x1 - 1 && y2 === y1) ||
      (x2 === x1 + 1 && y2 === y1) ||
      (x2 === x1 && y2 === y1 - 1) ||
      (x2 === x1 + 1 && y2 === y1 + 1) ||
      (x2 === x1 - 1 && y2 === y1 + 1) ||
      (x2 === x1 && y2 === y1 + 1)
    ) : (
      (x2 === x1 - 1 && y2 === y1 - 1) ||
      (x2 === x1 + 1 && y2 === y1 - 1) ||
      (x2 === x1 && y2 === y1 - 1 ) ||
      (x2 === x1 + 1 && y2 === y1) ||
      (x2 === x1 - 1 && y2 === y1) ||
      (x2 === x1 && y2 === y1 + 1)
    )
  }

  getCornerPosition( i: number ): p5.Vector {
    const angle = this.p.radians(60 * i - (this.flatTopped ? 0 : 30))
    return this.p.createVector(
      this.x + this.radius * this.p.cos(angle),
      this.y + this.radius * this.p.sin(angle)
    )
  }

  /** from 0 to 5, start on top */
  getNeighborPosition( i: number ): p5.Vector {
    switch (i) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
    }
  }

  update() {
    /* Mouse collision */
    const hovered = this.hovered()

    /* Path update */
    if(hovered && this.matrix.app.path)
      this.matrix.app.path.update(this)
  }

  draw( debug:boolean = false ) {
    if(this.isWall) return

    const
      pos = this.screenPosition,
      width = this.width,
      height = this.height

    /* Mouse collision */
    const hovered = this.hovered()

    if (!debug) {
      /* Draw image */
      this.p.push()
      this.p.translate(
        pos.x - (width * 1.2) * .5,
        pos.y - (height * 1.2) * .5
      )
      if(!this.flatTopped)
        this.p.rotate(this.p.radians(90))
      if(hovered) this.p.tint(255)
      else this.p.tint(200)
      this.p.noStroke()
      this.p.image(this.image,
        0, 0,
        width * 1.2,
        height * 1.2
      )
      this.p.pop()
    }

    else {
      /* Draw vectoriel nucleotide */
      if(hovered) this.color.setAlpha(255)
      else this.color.setAlpha(160)
      this.p.fill(this.color)
      this.p.stroke(10)
      this.p.strokeWeight(1)
      this.p.beginShape()
      for (let i = 0; i < 6; i++){
        const corner = this.getCornerPosition(i)
        this.p.vertex(corner.x,corner.y)
      }
      this.p.endShape(this.p.CLOSE)
      this.p.stroke(0)
      this.p.strokeWeight(10)
      this.p.fill(255)
      this.p.textSize(this.height * .15)
      this.p.textAlign(this.p.CENTER)
      this.p.text(`x${this.gridPosition.x} y${this.gridPosition.y}`,
        this.x, this.y + this.height * .41
      )
    }

  }

  toString(): string {
    return JSON.stringify({
      x: this.gridPosition.x,
      y: this.gridPosition.y
    })
  }
}