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
    public images: {[name:string]:p5.Image},
    colsCount: number,
    rowsCount: number,
    hexagonRadius: number,
    public pathMaxLength: number,
    flatTopped: boolean,
    public debug: boolean
  ) {
    this.matrix = new Matrix(
      this,
      colsCount,
      rowsCount,
      hexagonRadius,
      flatTopped
    )

    this.linkDynamicOptions()
  }


  getElementAs<T>( name: string ): T {
    //@ts-ignore
    return document.getElementById(name)
  }

  log( event: string, data: {[k:string]:any} ): App {
    this.logIndex ++
    const logs = document.getElementById("logs")
    const log = document.createElement("div")
    log.className = "log"
    log.innerHTML = `<span class="index">[${this.logIndex}]</span><span class="event">${event}</span> <ul>${Object.entries(data).map( entry => {
      return `<li><span class="name">${entry[0]}</span><span class="sign">=</span><span class="value">${entry[1]}</span></li>`
    }).join(' ')}</ul>`
    logs.appendChild(log)
    if(logs.children.length > 20)
      logs.children[0].remove()
    return this
  }

  draw(){
    this.matrix.draw(this.debug)
    if(this.path){
      this.path.draw(this.debug)
    }
  }

  mousePressed(){
    for(const hexagon of this.matrix.hexagons){
      if(hexagon.hovered()){
        this.path = new Path(this,hexagon)
        break
      }
    }
  }

  mouseReleased(){
    this.path.crunch()
    this.path = null
  }

  linkDynamicOptions(){
    // setup options values in form
    this.getElementAs<HTMLInputElement>("debug").checked = this.debug
    this.getElementAs<HTMLInputElement>("flatTopped").checked = this.matrix.flatTopped
    this.getElementAs<HTMLInputElement>("cols").value = String(this.matrix.colsCount)
    this.getElementAs<HTMLInputElement>("rows").value = String(this.matrix.rowsCount)
    this.getElementAs<HTMLInputElement>("hexagonRadius").value = String(this.matrix.hexagonRadius)
    this.getElementAs<HTMLInputElement>("pathMaxLength").value = String(this.pathMaxLength)

    // listen form
    this.getElementAs<HTMLInputElement>("debug").onchange = (function (event:Event) {
      this.debug = (event.target as HTMLInputElement).checked
      document.getElementById("logs").style.display = this.debug ? "flex" : "none"
    }).bind(this)
    this.getElementAs<HTMLInputElement>("flatTopped").onchange = (function (event:Event) {
      this.matrix.flatTopped = (event.target as HTMLInputElement).checked
    }).bind(this)
    this.getElementAs<HTMLInputElement>("cols").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        +(event.target as HTMLInputElement).value,
        this.matrix.rowsCount,
        this.matrix.hexagonRadius,
        this.matrix.flatTopped
      )
    }).bind(this)
    this.getElementAs<HTMLInputElement>("rows").onchange = (function (event:Event) {
      this.matrix = new Matrix(
        this,
        this.matrix.colsCount,
        +(event.target as HTMLInputElement).value,
        this.matrix.hexagonRadius,
        this.matrix.flatTopped
      )
    }).bind(this)
    this.getElementAs<HTMLInputElement>("hexagonRadius").onchange = (function (event:Event) {
      this.matrix.hexagonRadius = +(event.target as HTMLInputElement).value
    }).bind(this)
    this.getElementAs<HTMLInputElement>("pathMaxLength").onchange = (function (event:Event) {
      this.pathMaxLength = +(event.target as HTMLInputElement).value
    }).bind(this)
  }
}