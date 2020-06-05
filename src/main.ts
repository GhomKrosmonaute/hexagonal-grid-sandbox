
import './style.css'

//@ts-ignore
import P5 from 'p5'
import App from "./App/App"

// @ts-ignore
import blue from "./images/nucleotide_bleu.png"
//@ts-ignore
import red from "./images/nucleotide_rouge.png"
//@ts-ignore
import yellow from "./images/nucleotide_jaune.png"
//@ts-ignore
import green from "./images/nucleotide_verte.png"
//@ts-ignore
window.app = null

function sketch( p:P5 ){

  let images:{[folder:string]:{[name:string]:P5.Image}} = null

  p.preload = () => {
    images = {
      nucleotides: {
        blue: p.loadImage(blue),
        red: p.loadImage(red),
        yellow: p.loadImage(yellow),
        green: p.loadImage(green)
      }
    }
  }

  p.setup = () => {
    for(const name in images.nucleotides)
      images.nucleotides[name].resize( 75, 75 )
    p.createCanvas( 480, 480 )
    //@ts-ignore
    window.app = new App(p,
      /* images */
        images,
      /* nbr columns */
        6,
      /* nbr rows */
        5,
      /* nbr cuts */
      5,
      /* items radius */
        50,
      /* path max length */
        6,
      /* debug ? */
        true
    )
  }

  p.draw = () => {
    p.background(30)
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




