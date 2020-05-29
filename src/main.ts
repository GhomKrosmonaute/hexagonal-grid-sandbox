
import './style.css'

//@ts-ignore
import p5 from 'p5'
import Matrix from "./App/Matrix"

//@ts-ignore
import blue from "./images/nucleotide_bleu.png"
//@ts-ignore
import red from "./images/nucleotide_rouge.png"
//@ts-ignore
import yellow from "./images/nucleotide_jaune.png"
//@ts-ignore
import green from "./images/nucleotide_verte.png"

function sketch( p:p5 ){

  let matrix:Matrix = null
  let images:{[name:string]:p5.Image} = null

  p.preload = () => {
    images = {
      blue: p.loadImage(blue),
      red: p.loadImage(red),
      yellow: p.loadImage(yellow),
      green: p.loadImage(green),
    }
  }

  p.setup = () => {
    p.createCanvas(400,400)
    p.frameRate(15)
    matrix = new Matrix(p, images, 6, 6, 30, false)
  }

  p.draw = async () => {
    p.background(30);
    matrix.draw()
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new p5(sketch,document.getElementById('p5'))
})




