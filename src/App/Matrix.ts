import Hexagon from "./Hexagon"
//@ts-ignore
import p5 from 'p5'

export default class Matrix {

  public hexagons: Hexagon[] = []

  constructor(
    public p:p5,
    public images: {[name:string]:p5.Image},
    public colsCount: number,
    public rowsCount: number,
    public hexagonRadius: number,
    public flatTopped: boolean
  ) {
    for (let x = 0; x < colsCount; x++) {
      for (let y = 0; y < rowsCount; y++) {
        this.hexagons.push(
          new Hexagon(
            this,
            this.p.createVector(x, y)
          )
        )
      }
    }
  }

  draw( debug: boolean = false ) {
    for (const hexagon of this.hexagons)
      hexagon.draw(debug)
    this.p.fill(255)
    this.p.text(Math.round(this.p.frameRate()), 10, 10)
  }
}