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

  update() {
    for (const nucleotide of this.nucleotides)
      nucleotide.update()
  }

  draw( debug: boolean = false ) {
    for (const nucleotide of this.nucleotides)
      nucleotide.draw(debug)
  }
}