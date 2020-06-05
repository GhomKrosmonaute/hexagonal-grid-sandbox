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
  public readonly colorNames: [string,string,string,string] = ['blue','red','green','yellow']

  constructor(
    public p:p5,
    colsCount: number,
    rowsCount: number,
    cutCount: number,
    nucleotideRadius: number,
    public pathMaxLength: number,
    public debug: boolean
  ) {
    this.matrix = new Matrix(
      this,
      colsCount,
      rowsCount,
      cutCount,
      nucleotideRadius
    )
    this.generateSequence()
    this.setupPanel()
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
      case 'blue': return this.p.color('#247ba0')
      case 'red': return this.p.color('#f25f5c')
      case 'yellow': return this.p.color('#ffe066')
      case 'green': return this.p.color('#70c1b3')
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
    if(this.path) this.path.draw(this.debug)

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
      const xedni = (this.pathMaxLength-1)-index
      if(this.path && (
        (this.path.items.filter(n => !n.isCut)[index] && this.path.items.filter(n => !n.isCut)[index].colorName === colorName) ||
        (this.path.items.filter(n => !n.isCut)[xedni] && this.path.items.filter(n => !n.isCut)[xedni].colorName === colorName)
      )) {
        this.p.stroke(255)
        this.p.strokeWeight(3)
      }
      else this.p.noStroke()
      this.p.ellipse(
        (this.p.width - this.pathMaxLength * 50) + (index * 50 + 25),
        this.p.height - 25, 30
      )
    })
  }

  mousePressed(){
    const hovered = this.getHovered()
    if(hovered && (!this.path || !this.path.items.includes(hovered))){
      if(this.state === "crunch"){
        if(!hovered.isCut)
          this.path = new Path(this, hovered)
      }else{
        this.path = new Path(this, hovered)
      }
    }
  }

  mouseReleased(){
    if(this.p.mouseButton === this.p.LEFT){
      if(this.path){
        if(this.path.items.length === 1) {
          const n = this.path.first
          n.isHole = !n.isHole
          this.log('Hole ' + (n.isHole ? 'placed' : 'removed'), {
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
    this.getInput("cuts").value = String(this.matrix.cutCount)
    this.getInput("nucleotideRadius").value = String(this.matrix.nucleotideRadius)
    this.getInput("pathMaxLength").value = String(this.pathMaxLength)
    this.getInput(this.state).checked = true

    // listen game buttons
    this.getButton("cancel").onclick = (function (event:Event) {
      this.path = null
    }).bind(this)
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
    this.getButton("matrix").onclick = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        this.matrix.rowsCount,
        this.matrix.cutCount,
        this.matrix.nucleotideRadius
      )
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
        this.matrix.cutCount,
        this.matrix.nucleotideRadius
      )
    }).bind(this)
    this.getInput("rows").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        +(event.target as HTMLInputElement).value,
        this.matrix.cutCount,
        this.matrix.nucleotideRadius
      )
    }).bind(this)
    this.getInput("cuts").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        this.matrix.rowsCount,
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