
import './style.css'

//@ts-ignore
import P5 from 'p5'
import App from "./App/App"

//@ts-ignore
window.app = null

function sketch( p:P5 ){

  p.preload = () => {

  }

  p.setup = () => {
    p.createCanvas( 600,600)
    //@ts-ignore
    window.app = new App(p,
      /* nbr columns */
        7,
      /* nbr rows */
        7,
      /* nbr cuts */
      9,
      /* items radius */
        40,
      /* path max length */
        5,
      /* debug ? */
        true
    )
  }

  p.draw = () => {
    p.background(0)
    //@ts-ignore
    window.app.update()
    //@ts-ignore
    window.app.draw()
  }

  p.mousePressed = () => {
    //@ts-ignore
    window.app.mousePressed()
  }

  p.mouseReleased = () => {
    //@ts-ignore
    window.app.mouseReleased()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new P5(sketch,document.getElementById('p5'))
})




