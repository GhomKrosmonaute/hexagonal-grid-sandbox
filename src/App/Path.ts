//@ts-ignore
import p5 from "p5";
import App from './App';
import Nucleotide from './Nucleotide';

export default class Path {

  public items: Nucleotide[] = []

  constructor(
    public app: App,
    start: Nucleotide
  ) {
    this.items.push(start)
  }

  get length(): number {
    return this.nucleotides.length
  }

  get nucleotides(): Nucleotide[] {
    return this.items.filter(n => !n.isCut)
  }

  get cuts(): Nucleotide[] {
    return this.items.filter(n => n.isCut)
  }

  get isValidSequence(): boolean {
    const signature = this.nucleotides.map(n => n.colorName).join(',')
    return this.cuts.length >= 1 && (
      signature === this.app.sequence.join(',') ||
      signature === this.app.sequence.slice(0).reverse().join(',')
    )
  }

  get p(): p5 {
    return this.app.p
  }

  get maxLength(): number {
    return this.app.pathMaxLength
  }

  get first(): Nucleotide | null {
    return this.items[0]
  }

  update(nucleotide: Nucleotide): void {

    // in crunch path case
    if(this.app.state === "crunch"){
      // check if the current nucleotide is a wall/hole/cut
      if(this.length > 0 && nucleotide.isHole) return
      if(this.first.isHole) return
    }

    // check the cancellation & cancel to previous nucleotide
    if(
      this.items[this.items.length-2] &&
      this.items[this.items.length-2] === nucleotide
    ) {
      this.items.pop()
      return
    }

    // check if this path is terminated or not
    if(this.length >= (
      this.app.state === "crunch" ? this.maxLength : 2
    )) return

    // check if nucleotide is already in this path
    if(this.items.includes(nucleotide)) return

    // check if the current nucleotide is a neighbor of the last checked nucleotide
    if(
      this.items[this.items.length-1] &&
      this.items[this.items.length-1].getNeighborIndex(nucleotide) === -1
    ) return null

    // push in this path the checked nucleotide
    this.items.push(nucleotide)
  }

  draw( debug:boolean = false ){
    if(debug || true){
      let last: Nucleotide = null
      let color: p5.Color = this.isValidSequence ? this.p.color(255) : this.p.color(0)

      // for all nucleotide in path
      for(const nucleotide of this.items){

        this.p.noStroke()
        this.p.fill(color)

        // draw ellipse
        this.p.ellipse(
          nucleotide.x,
          nucleotide.y,
          nucleotide.width * .4
        )

        if(last){

          // draw line
          this.p.strokeWeight(5)
          this.p.stroke(color)
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
    if(this.isValidSequence){
      this.app.log("Validated Path", {
        length: this.length,
        // @ts-ignore
        ...Object.fromEntries(this.items.filter(n => !n.isCut).map((n, i) => {
          return [String(i),n.toString()]
        }))
      })
      this.items.forEach(n => {
        n.isHole = true
        n.isCut = false
      })
      this.app.generateSequence()
    }else{
      this.app.log("Unvalidated Path", {
        length: this.length,
        // @ts-ignore
        ...Object.fromEntries(this.items.filter(n => !n.isCut).map((n, i) => {
          return [String(i),n.toString()]
        }))
      })
    }
  }

  slide(){
    if(!this.items[1]) return

    const neighborIndex = this.items[0].getNeighborIndex(this.items[1])

    this.app.log("Slide", {
      direction: neighborIndex
    })

    this.app.matrix.slide(neighborIndex)
  }
}