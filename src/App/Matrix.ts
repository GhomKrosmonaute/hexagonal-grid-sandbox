import Hexagon from "./Hexagon"
//@ts-ignore
import p5 from 'p5'
import App from './App';

export default class Matrix {

  public hexagons: Hexagon[] = []

  constructor(
    public app: App,
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

  get p(): p5 {
    return this.app.p
  }

  draw( debug: boolean = false ) {
    for (const hexagon of this.hexagons)
      hexagon.draw(debug)
    if(debug){
      this.p.fill(255)
      this.p.text(Math.round(this.p.frameRate()), 10, 10)
    }
  }
}