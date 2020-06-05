import Nucleotide from "./Nucleotide"
//@ts-ignore
import p5 from 'p5'
import App from './App';

export default class Matrix {

  public nucleotides: Nucleotide[] = []

  constructor(
    public app: App,
    public colsCount: number,
    public rowsCount: number,
    public cutCount: number,
    public nucleotideRadius: number
  ) {
    for (let x = 0; x < colsCount; x++) {
      for (let y = 0; y < rowsCount; y++) {
        this.nucleotides.push(
          new Nucleotide(
            this,
            this.p.createVector(x, y)
          )
        )
      }
    }
    this.addCuts()
  }

  get p(): p5 {
    return this.app.p
  }

  slide( neighborIndex: number ){
    const opposedNeighborIndex = this.app.opposedIndexOf(neighborIndex)
    for (const nucleotide of this.nucleotides)
      if(nucleotide.isHole){
        nucleotide.generate()
        nucleotide.recursiveSwap(opposedNeighborIndex)
      }
    this.addCuts()
  }

  addCuts(){
    while (this.nucleotides.filter(n => n.isCut).length < this.cutCount) {
      let randomIndex
      do { randomIndex = Math.floor(Math.random() * this.nucleotides.length) }
      while (this.nucleotides[randomIndex].isCut)
      this.nucleotides[randomIndex].isCut = true
    }
  }

  update() {
    for (const nucleotide of this.nucleotides)
      nucleotide.update()
  }

  draw( debug: boolean = false ) {
    for (const nucleotide of this.nucleotides)
      nucleotide.draw(debug)
  }
}