//@ts-ignore
import p5 from "p5";
import Matrix from './Matrix';
import Path from './Path';

export default class App {

  public path: Path
  public matrix: Matrix
  public logIndex: number = 0

  constructor(
    public p:p5,
    public images: any,
    colsCount: number,
    rowsCount: number,
    nucleotideRadius: number,
    public pathMaxLength: number,
    flatTopped: boolean,
    public debug: boolean
  ) {
    this.matrix = new Matrix(
      this,
      colsCount,
      rowsCount,
      nucleotideRadius,
      flatTopped
    )

    this.linkDynamicOptions()
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

  draw(){
    this.matrix.draw(this.debug)
    if(this.path){
      this.path.draw(this.debug)
    }
  }

  mousePressed(){
    for(const nucleotide of this.matrix.nucleotides){
      if(nucleotide.hovered()){
        this.path = new Path(this,nucleotide)
        break
      }
    }
  }

  mouseReleased(){
    if(this.path){
      this.path.crunch()
      this.path = null
    }
  }

  linkDynamicOptions(){
    // setup options values in form
    this.getInput("debug").checked = this.debug
    this.getInput("flatTopped").checked = this.matrix.flatTopped
    this.getInput("cols").value = String(this.matrix.colsCount)
    this.getInput("rows").value = String(this.matrix.rowsCount)
    this.getInput("nucleotideRadius").value = String(this.matrix.nucleotideRadius)
    this.getInput("pathMaxLength").value = String(this.pathMaxLength)

    // listen form
    this.getInput("debug").onchange = (function (event:Event) {
      this.debug = (event.target as HTMLInputElement).checked
      document.getElementById("logs").style.display = this.debug ? "flex" : "none"
    }).bind(this)
    this.getInput("flatTopped").onchange = (function (event:Event) {
      this.matrix.flatTopped = (event.target as HTMLInputElement).checked
    }).bind(this)
    this.getInput("cols").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        +(event.target as HTMLInputElement).value,
        this.matrix.rowsCount,
        this.matrix.nucleotideRadius,
        this.matrix.flatTopped
      )
    }).bind(this)
    this.getInput("rows").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        +(event.target as HTMLInputElement).value,
        this.matrix.nucleotideRadius,
        this.matrix.flatTopped
      )
    }).bind(this)
    this.getInput("nucleotideRadius").onchange = (function (event:Event) {
      this.matrix.nucleotideRadius = +(event.target as HTMLInputElement).value
    }).bind(this)
    this.getInput("pathMaxLength").onchange = (function (event:Event) {
      this.pathMaxLength = +(event.target as HTMLInputElement).value
    }).bind(this)
  }
}