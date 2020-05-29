import Matrix from "./Matrix"
//@ts-ignore
import * as p5 from "p5";

export default class Hexagon {

  public image:p5.Image

  constructor(
    public matrix:Matrix,
    public gridPosition:p5.Vector
  ) {
    this.image = Object.values(matrix.images)[
      Math.floor(Math.random() * Object.keys(matrix.images).length)
    ]
  }

  get p(): p5 {
    return this.matrix.p
  }

  get flatTopped(): boolean {
    return this.matrix.flatTopped
  }

  get radius(): number {
    return this.matrix.hexagonRadius
  }

  get width(): number {
    return !this.flatTopped ? this.p.sqrt(3) * this.radius : 2 * this.radius
  }

  get height(): number {
    return !this.flatTopped ? 2 * this.radius : this.p.sqrt(3) * this.radius
  }

  get dist(): p5.Vector {
    return this.p.createVector(
      this.flatTopped ? this.width * (3 / 4) : this.width,
      this.flatTopped ? this.height : this.height * (3 / 4)
    )
  }

  get x(): number {
    return this.flatTopped ?
      (this.width / 2 + this.gridPosition.x * this.dist.x) :
      (this.gridPosition.x * this.width - this.width / 2) +
      (this.gridPosition.y % 2 === 0 ? this.width / 2 : 0) + this.width
  }

  get y(): number {
    return this.flatTopped ?
      (this.gridPosition.y * this.height - this.height / 2) +
      (this.gridPosition.x % 2 === 0 ? this.height / 2 : 0) + this.height :
      (this.height / 2 + this.gridPosition.y * this.dist.y)
  }

  get screenPosition(): p5.Vector {
    return this.p.createVector(this.x, this.y)
  }

  getCornerPosition( i: number ) {
    const angle = this.p.radians(60 * i - (this.flatTopped ? 0 : 30))
    return this.p.createVector(
      this.screenPosition.x + this.radius * this.p.cos(angle),
      this.screenPosition.y + this.radius * this.p.sin(angle)
    )
  }

  draw( debug:boolean = false ) {
    this.p.fill(100)
    this.p.tint(230)

    /* Mouse collision */
    const collision = this.p.dist(
      this.screenPosition.x,this.screenPosition.y,
      this.p.mouseX,this.p.mouseY
    ) < this.radius * 0.9

    if (!debug) {
      /* Draw image */
      if(collision) this.p.tint(255)
      this.p.image(this.image,
        this.screenPosition.x - this.width * .5,
        this.screenPosition.y - this.height * .5,
        this.width, this.height
      )
    }

    else {
      /* Draw vectoriel hexagon */
      if(collision) this.p.fill(200)
      this.p.beginShape()
      for (let i = 0; i < 6; i++){
        const corner = this.getCornerPosition(i)
        this.p.vertex(corner.x,corner.y)
      }
      this.p.endShape(this.p.CLOSE)
    }

  }
}