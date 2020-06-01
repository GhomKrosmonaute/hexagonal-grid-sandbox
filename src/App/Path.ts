//@ts-ignore
import p5 from "p5";
import App from './App';
import Nucleotide from './Nucleotide';

export default class Path {

  public nucleotides: Nucleotide[] = []
  public slider: boolean = false

  constructor(
    public app: App,
    start: Nucleotide
  ) {
    this.nucleotides.push(start)
  }

  get p(): p5 {
    return this.app.p
  }

  get maxLength(): number {
    return this.app.pathMaxLength
  }

  update(nucleotide: Nucleotide): void {
    if(
      this.nucleotides.length === 1 &&
      nucleotide.isWall
    ) {
      this.slider = true
    }else if(
      this.nucleotides.length > 1 &&
      nucleotide.isWall
    ) return
    if(
      this.nucleotides[this.nucleotides.length-2] &&
      this.nucleotides[this.nucleotides.length-2] === nucleotide
    ) {
      this.nucleotides.pop()
      return
    }else if(this.nucleotides[this.nucleotides.length-1].isWall)
      return
    if(this.nucleotides.length >= this.maxLength) return
    if(this.nucleotides.includes(nucleotide)) return
    if(
      this.nucleotides[this.nucleotides.length-1] &&
      !this.nucleotides[this.nucleotides.length-1].isNeighborOf(nucleotide)
    ) return null
    this.nucleotides.push(nucleotide)
  }

  draw( debug:boolean = false ){
    if(debug || true){
      let last: Nucleotide = null
      for(const nucleotide of this.nucleotides){
        this.p.noStroke()
        this.p.fill(255)
        this.p.ellipse(
          nucleotide.x,
          nucleotide.y,
          nucleotide.width * .5
        )
        if(last){
          this.p.strokeWeight(3)
          this.p.stroke(255)
          this.p.line(
            last.x,
            last.y,
            nucleotide.x,
            nucleotide.y
          )
        }
        last = nucleotide
      }
    }

  }

  crunch(){
    this.app.log("Crunched Path", {
      length: this.nucleotides.length,
      start: this.nucleotides[0].toString()
    })
  }

  slide(){
    this.app.log("Slided Path", {
      start: this.nucleotides[0].toString(),
      stop: this.nucleotides[1].toString()
    })
  }

}