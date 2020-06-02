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
  public pathList: Path[] = []

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

    this.linkDynamicOptions()
  }

  get hovered(): Nucleotide | null {
    return this.matrix.nucleotides
      .find( nucleotide => nucleotide.hovered() )
  }

  getInput( name: string ): HTMLInputElement {
    return document.getElementById(name) as HTMLInputElement
  }

  log( event: string, data: {[k:string]:string|number|boolean} ): App {
    this.logIndex ++
    const logs = document.getElementById("logs")
    const log = document.createElement("div")
    log.className = "log"
    log.innerHTML = `<span class="index">[${this.logIndex}]</span><span class="event">${event}</span> <ul>${Object.entries(data).map( entry => {
      return `<li><span class="name">${entry[0]}</span><span class="sign">=</span><span class="value">${entry[1]}</span></li>`
    }).join(' ')}</ul>`
    logs.appendChild(log)
    if(
      logs.getBoundingClientRect().height >
      document.body.getBoundingClientRect().height
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
    if(this.debug){
      this.p.noStroke()
      this.p.fill(255)
      this.p.text('Framerate: ' + Math.round(this.p.frameRate()), 10, 10)
    }
  }

  mousePressed(){
    const hovered = this.hovered
    if(this.p.mouseButton === this.p.LEFT) {
      if(hovered && !hovered.isWall)
        this.path = new Path(this, hovered)
    }else{
      if(hovered) hovered.isWall = true
      this.log("Hole/Wall placed", {
        position: hovered.toString()
      })
    }
  }

  mouseReleased(){
    if(this.p.mouseButton === this.p.LEFT){
      if(this.path){
        if(this.state === "slide")
          this.path.slide()
        else this.path.crunch()
        this.path = null
      }
    }
  }

  linkDynamicOptions(){
    // setup options values in form
    this.getInput("debug").checked = this.debug
    this.getInput("cols").value = String(this.matrix.colsCount)
    this.getInput("rows").value = String(this.matrix.rowsCount)
    this.getInput("nucleotideRadius").value = String(this.matrix.nucleotideRadius)
    this.getInput("pathMaxLength").value = String(this.pathMaxLength)
    this.getInput(this.state).checked = true

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
    }).bind(this)
    const stateListener = (function(event:Event){
      this.state = this.getInput("crunch").checked ? "crunch" : "slide"
    }).bind(this)
    this.getInput("crunch").onchange = stateListener
    this.getInput("slide").onchange = stateListener
  }
}