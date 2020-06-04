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
  }

  get p(): p5 {
    return this.app.p
  }

  slide( neighborIndex: number ){
    const opposedNeighborIndex = this.app.opposedIndexOf(neighborIndex)
    for (const nucleotide of this.nucleotides)
      if(nucleotide.isWall){
        nucleotide.generate()
        nucleotide.recursiveSwap(opposedNeighborIndex)
        // const neighbors = nucleotide.getNeighbors(opposedNeighborIndex)
        // nucleotide.matrixPosition.set(neighbors[neighbors.length-1].matrixPosition)
        // for (const neighbor of neighbors)
        //   neighbor.moveByNeighborIndex(neighborIndex)
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