import Matrix from "./Matrix"
//@ts-ignore
import p5 from "p5";

export default class Nucleotide {

  public image: p5.Image
  public color: p5.Color
  public colorName: string
  public isWall: boolean = false

  constructor(
    public matrix: Matrix,
    public matrixPosition: p5.Vector
  ) {
    const colors = Object.keys(matrix.app.images.nucleotides)
    this.colorName = colors[Math.floor(Math.random()*colors.length)]
    this.image = matrix.app.images.nucleotides[this.colorName]
    switch (this.colorName) {
      case 'blue': this.color = this.p.color(0,0,255); break
      case 'red': this.color = this.p.color(255,0,0); break
      case 'yellow': this.color = this.p.color(255,255,0); break
      case 'green': this.color = this.p.color(0,255,0); break
    }
  }

  get evenCol(): boolean {
    return this.matrixPosition.x % 2 === 0
  }

  get p(): p5 {
    return this.matrix.p
  }

  get radius(): number {
    return this.matrix.nucleotideRadius
  }

  get width(): number {
    return 2 * this.radius
  }

  get height(): number {
    return this.p.sqrt(3) * this.radius
  }

  get dist(): p5.Vector {
    return this.p.createVector(
      this.width * (3 / 4), this.height
    )
  }

  get x(): number {
    return this.width / 2 + this.matrixPosition.x * this.dist.x
  }

  get y(): number {
    const height = this.height
    return (this.matrixPosition.y * height - height / 2)
      + (this.evenCol ? height / 2 : 0) + height
  }

  get isHovered(): boolean {
    return this.p.dist(
      this.x,this.y,
      this.p.mouseX,this.p.mouseY
    ) < this.radius * 0.86
  }

  recursiveMove( neighborIndex: number ){
    // get the target neighbor
    const neighbor = this.getNeighbor(neighborIndex)

    // get the opposed neighbor
    let opposedNeighborIndex = neighborIndex - 3
    if(opposedNeighborIndex < 0) opposedNeighborIndex += 6
    const opposedNeighbor = this.getNeighbor(opposedNeighborIndex)

    // swap places with this nucleotide
    const oldMatrixPosition = this.matrixPosition.copy()
    this.matrixPosition = neighbor.matrixPosition.copy()
    neighbor.matrixPosition = oldMatrixPosition.copy()

    // continue recursively
    if(opposedNeighbor) opposedNeighbor.recursiveMove(neighborIndex)
  }

  /** @param {number} neighborIndex - from 0 to 5, start on top  */
  getNeighbor( neighborIndex: number ): Nucleotide | null {
    return this.matrix.nucleotides.find( n => {
      return this.getNeighborIndex(n) === neighborIndex
    })
  }

  /** @returns {number} -1 if is not a neighbor, or the neighbor index */
  getNeighborIndex( nucleotide: Nucleotide ): number {
    for(let i=0; i<6; i++){
      if(this.getNeighborMatrixPosition(i)
        .equals(nucleotide.matrixPosition)
      ) return i
    } return -1
  }

  /** @param {number} cornerIndex - from 0 to 5, start on right corner */
  getCornerPosition( cornerIndex: number ): p5.Vector {
    const angle = this.p.radians(60 * cornerIndex)
    return this.p.createVector(
      this.x + this.radius * this.p.cos(angle),
      this.y + this.radius * this.p.sin(angle)
    )
  }

  /** @param {number} neighborIndex - from 0 to 5, start on top  */
  getNeighborMatrixPosition( neighborIndex: number ): p5.Vector {
    const matrixPosition = this.matrixPosition.copy()
    switch (neighborIndex) {
      case 0: matrixPosition.y --; break
      case 3: matrixPosition.y ++; break
      case 1:
        matrixPosition.x ++
        if(!this.evenCol)
          matrixPosition.y --
        break
      case 5:
        matrixPosition.x --
        if(!this.evenCol)
          matrixPosition.y --
        break
      case 2:
        matrixPosition.x ++
        if(this.evenCol)
          matrixPosition.y ++
        break
      case 4:
        matrixPosition.x --
        if(this.evenCol)
          matrixPosition.y ++
        break
    }
    return matrixPosition
  }

  update() {
    /* Mouse collision */
    const hovered = this.isHovered

    /* Path update */
    if(hovered && this.matrix.app.path)
      this.matrix.app.path.update(this)
  }

  draw( debug:boolean = false ) {
    if(this.isWall) return

    /* Mouse collision */
    const hovered = this.isHovered

    if (!debug) {
      /* Draw image */
      this.p.push()
      this.p.translate(
        this.x - (this.width * 1.2) * .5,
        this.y - (this.height * 1.2) * .5
      )
      if(hovered) this.p.tint(255)
      else this.p.tint(200)
      this.p.noStroke()
      this.p.image(this.image,
        0, 0,
        this.width * 1.2,
        this.height * 1.2
      )
      this.p.pop()
    }

    else {
      /* Draw vectoriel nucleotide */
      if(hovered) this.color.setAlpha(255)
      else this.color.setAlpha(160)
      this.p.fill(this.color)
      this.p.stroke(10)
      this.p.strokeWeight(1)
      this.p.beginShape()
      for (let i = 0; i < 6; i++){
        const corner = this.getCornerPosition(i)
        this.p.vertex(corner.x,corner.y)
      }
      this.p.endShape(this.p.CLOSE)
      this.p.stroke(0)
      this.p.strokeWeight(10)
      this.p.fill(255)
      this.p.textSize(this.height * .15)
      this.p.textAlign(this.p.CENTER)
      this.p.text(`x${this.matrixPosition.x} y${this.matrixPosition.y}`,
        this.x, this.y + this.height * .41
      )
    }

  }

  toString(): string {
    return JSON.stringify({
      x: this.matrixPosition.x,
      y: this.matrixPosition.y
    })
  }
}