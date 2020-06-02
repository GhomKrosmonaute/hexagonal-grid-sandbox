//@ts-ignore
import p5 from "p5";
import App from './App';
import Nucleotide from './Nucleotide';

export default class Path {

  public nucleotides: Nucleotide[] = []
  //public slider: boolean = false

  constructor(
    public app: App,
    start: Nucleotide
  ) {
    this.nucleotides.push(start)
  }

  get other(): Path[] {
    return this.app.pathList
  }

  get p(): p5 {
    return this.app.p
  }

  get maxLength(): number {
    return this.app.pathMaxLength
  }

  update(nucleotide: Nucleotide): void {

    // if(
    //   this.nucleotides.length === 1 &&
    //   nucleotide.isWall
    // ) {
    //   this.slider = true
    // }else if(
    //   this.nucleotides.length > 1 &&
    //   nucleotide.isWall
    // ) return

    // in crunch path case
    if(this.app.state === "crunch"){
      // check if the current nucleotide is a wall/hole
      if(nucleotide.isWall) return
    }

    // check the cancellation & cancel to previous nucleotide
    if(
      this.nucleotides[this.nucleotides.length-2] &&
      this.nucleotides[this.nucleotides.length-2] === nucleotide
    ) {
      this.nucleotides.pop()
      return
    }

    // check if this path is terminated or not
    if(this.nucleotides.length >= (
      this.app.state === "crunch" ? this.maxLength : 2
    )) return

    // check if nucleotide is already in this path
    if(this.nucleotides.includes(nucleotide)) return

    // check if the current nucleotide is a neighbor of the last checked nucleotide
    if(
      this.nucleotides[this.nucleotides.length-1] &&
      this.nucleotides[this.nucleotides.length-1].getNeighborIndex(nucleotide) === -1
    ) return null

    // push in this path the checked nucleotide
    this.nucleotides.push(nucleotide)
  }

  draw( debug:boolean = false ){
    if(debug || true){
      let last: Nucleotide = null

      // for all nucleotide in path
      for(const nucleotide of this.nucleotides){

        // draw ellipse
        this.p.noStroke()
        this.p.fill(255)
        this.p.ellipse(
          nucleotide.x,
          nucleotide.y,
          nucleotide.width * .5
        )
        if(last){

          // draw line
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
      // @ts-ignore
      ...Object.fromEntries(this.nucleotides.map((n,i) => {
        return [String(i),n.toString()]
      }))
    })
  }

  slide(){
    this.app.log("Slided Path", {
      from: this.nucleotides[0].toString(),
      direction: this.nucleotides[0].getNeighborIndex(this.nucleotides[1])
    })
  }

}