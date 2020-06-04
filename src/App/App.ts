//@ts-ignore
import p5 from "p5";
import Matrix from './Matrix';
import Path from './Path';
import Nucleotide from './Nucleotide';

export default class App {

  public path: Path
  public matrix: Matrix
  public logIndex: number = 0
  public state: "crunch" | "slide" = "crunch"
  public sequence: string[]

  constructor(
    public p:p5,
    public images: any,
    colsCount: number,
    rowsCount: number,
    nucleotideRadius: number,
    public pathMaxLength: number,
    public debug: boolean
  ) {
    this.matrix = new Matrix(
      this,
      colsCount,
      rowsCount,
      nucleotideRadius
    )
    this.generateSequence()
    this.setupPanel()
  }

  get colorNames(): string[] {
    return Object.keys(this.images.nucleotides)
  }

  getHovered(): Nucleotide | null {
    return this.matrix.nucleotides
      .find( nucleotide => nucleotide.isHovered )
  }

  getInput( name: string ): HTMLInputElement {
    return document.getElementById(name) as HTMLInputElement
  }
  getButton( name: string ): HTMLButtonElement {
    return document.getElementById(name) as HTMLButtonElement
  }

  getColor( name: string ): p5.Color {
    switch (name) {
      case 'blue': return this.p.color(0,0,255)
      case 'red': return this.p.color(255,0,0)
      case 'yellow': return this.p.color(255,255,0)
      case 'green': return this.p.color(0,255,0)
    }
  }

  generateSequence(): string[] {
    const sequence: string[] = []
    for(let i=0; i<this.pathMaxLength; i++)
      sequence.push(this.colorNames[Math.floor(Math.random()*this.colorNames.length)])
    this.sequence = sequence
    return sequence
  }

  opposedIndexOf( neighborIndex: number ): number {
    let opposedNeighborIndex = neighborIndex - 3
    if(opposedNeighborIndex < 0) opposedNeighborIndex += 6
    return opposedNeighborIndex
  }

  log( event: string, data: {[k:string]:string|number|boolean} ): App {
    this.logIndex ++
    const logs = document.getElementById("logs")
    const log = document.createElement("div")
    log.className = "log"
    log.innerHTML = `<span class="index">[${this.logIndex}]</span><span class="event">${event}</span> <ul>${Object.entries(data).map( entry => {
      return `<li><span class="name">${entry[0]}</span><span class="sign">=</span><span class="value">${entry[1]}</span></li>`
    }).join(' ')}</ul>`.replace(/"/g,'')
    logs.appendChild(log)
    if(
      logs.children.length > 30
    ) logs.children[0].remove()
    return this
  }

  update(){
    this.matrix.update()
  }

  draw(){
    this.matrix.draw(this.debug)
    if(this.path){
      this.path.draw(this.debug)
    }

    // show current sequence
    this.p.noStroke()
    this.p.fill(0,170)
    this.p.rect(
      this.p.width - this.pathMaxLength * 50,
      this.p.height - 50,
      this.pathMaxLength * 50,
      50
    )
    this.sequence.forEach(( colorName, index ) => {
      this.p.fill(this.getColor(colorName))
      this.p.ellipse(
        (this.p.width - this.pathMaxLength * 50) + (index * 50 + 25),
        this.p.height - 25, 30
      )
    })

    if(this.debug){
      this.p.noStroke()
      this.p.fill(0,170)
      this.p.rect(0, 0,
        this.p.width, 35
      )
      this.p.fill(255)
      this.p.textSize(20)
      this.p.textAlign(this.p.LEFT)
      this.p.text('Framerate: ' + Math.round(this.p.frameRate()), 10, 25)
    }
  }

  mousePressed(){
    const hovered = this.getHovered()
    if(hovered && (!this.path || !this.path.nucleotides.includes(hovered)))
      this.path = new Path(this, hovered)
  }

  mouseReleased(){
    if(this.p.mouseButton === this.p.LEFT){
      if(this.path){
        if(this.path.length === 1) {
          const n = this.path.first
          n.isWall = !n.isWall
          this.log('Hole/Wall ' + (n.isWall ? 'placed' : 'removed'), {
            position: n.toString()
          })
          this.path = null
        }else if(this.state === "slide") {
          this.path.slide()
          this.path = null
        }
      }
    }
  }

  setupPanel(){
    // setup options values in form
    this.getInput("debug").checked = this.debug
    this.getInput("cols").value = String(this.matrix.colsCount)
    this.getInput("rows").value = String(this.matrix.rowsCount)
    this.getInput("nucleotideRadius").value = String(this.matrix.nucleotideRadius)
    this.getInput("pathMaxLength").value = String(this.pathMaxLength)
    this.getInput(this.state).checked = true

    // listen game buttons
    this.getButton("validate").onclick = (function (event:Event) {
      if(this.state === "crunch"){
        if(this.path) {
          this.path.crunch()
          this.path = null
        }
      }
    }).bind(this)
    this.getButton("sequence").onclick = (function (event:Event) {
      this.generateSequence()
    }).bind(this)

    // listen form
    this.getInput("debug").onchange = (function (event:Event) {
      this.debug = (event.target as HTMLInputElement).checked
      document.getElementById("logs").style.display = this.debug ? "flex" : "none"
    }).bind(this)
    this.getInput("cols").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        +(event.target as HTMLInputElement).value,
        this.matrix.rowsCount,
        this.matrix.nucleotideRadius
      )
    }).bind(this)
    this.getInput("rows").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        +(event.target as HTMLInputElement).value,
        this.matrix.nucleotideRadius
      )
    }).bind(this)
    this.getInput("nucleotideRadius").onchange = (function (event:Event) {
      this.matrix.nucleotideRadius = +(event.target as HTMLInputElement).value
    }).bind(this)
    this.getInput("pathMaxLength").onchange = (function (event:Event) {
      this.pathMaxLength = +(event.target as HTMLInputElement).value
      this.generateSequence()
    }).bind(this)
    const stateListener = (function(event:Event){
      this.state = this.getInput("crunch").checked ? "crunch" : "slide"
    }).bind(this)
    this.getInput("crunch").onchange = stateListener
    this.getInput("slide").onchange = stateListener
  }
}