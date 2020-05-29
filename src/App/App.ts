//@ts-ignore
import p5 from "p5";
import Matrix from './Matrix';
import Path from './Path';

export default class App {

  public path: Path
  public matrix: Matrix

  constructor(
    public p:p5,
    public images: {[name:string]:p5.Image},
    colsCount: number,
    rowsCount: number,
    hexagonRadius: number,
    flatTopped: boolean
  ) {
    this.matrix = new Matrix(
      this,
      colsCount,
      rowsCount,
      hexagonRadius,
      flatTopped
    )
  }

  draw( debug: boolean = false ){
    this.matrix.draw(debug)
    if(this.path){
      this.path.draw(debug)
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

}