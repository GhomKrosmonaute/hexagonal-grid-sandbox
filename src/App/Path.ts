//@ts-ignore
import p5 from "p5";
import App from './App';
import Hexagon from './Hexagon';

export default class Path {

  public hexagons: Hexagon[] = []

  constructor(
    public app: App,
    start: Hexagon
  ) {
    this.hexagons.push(start)
  }

  get p(): p5 {
    return this.app.p
  }

  get maxLength(): number {
    return this.app.pathMaxLength
  }

  update(hexagon: Hexagon): void {
    if(
      this.hexagons[this.hexagons.length-2] &&
      this.hexagons[this.hexagons.length-2] === hexagon
    ) {
      this.hexagons.pop()
      return
    }
    if(this.hexagons.length >= this.maxLength) return
    if(hexagon.isWall || this.hexagons.includes(hexagon)) return
    if(
      this.hexagons[this.hexagons.length-1] &&
      !this.hexagons[this.hexagons.length-1].touchSideOf(hexagon)
    ) return null
    this.hexagons.push(hexagon)
  }

  draw( debug:boolean = false ){
    if(debug || true){
      let last: Hexagon = null
      for(const hexagon of this.hexagons){
        this.p.noStroke()
        this.p.fill(255,0,0)
        this.p.ellipse(
          hexagon.x,
          hexagon.y,
          hexagon.width * .5
        )
        if(last){
          this.p.strokeWeight(3)
          this.p.stroke(255,0,0,100)
          this.p.line(
            last.x,
            last.y,
            hexagon.x,
            hexagon.y
          )
        }
        last = hexagon
      }
    }

  }

  crunch(){
    this.app.log("Crunched Path", {
      length: this.hexagons.length,
      start: this.hexagons[0].toString()
    })
  }

}