class Star {
  ctx: CanvasRenderingContext2D
  id: number
  x: number
  y: number
  r: number
  color: string
  constructor (ctx: CanvasRenderingContext2D, id: number, x: number, y: number) {
    this.ctx = ctx
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random() * 2) + 1;
    const alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = 'rgba(255,255,255,' + alpha + ')';
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.shadowBlur = this.r * 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  move() {
    this.y -= 0.15;
    if (this.y <= -10) this.y = window.innerHeight + 10;
    this.draw();
  }
}

class Dot {
  ctx: CanvasRenderingContext2D
  id: number
  x: number
  y: number
  r: number
  maxLinks = 2
  speed = 0.5
  a = 0.6
  aReduction = 0.005
  color: string
  linkColor: string
  dir: number
  dots: Array<Dot | null>
  constructor(ctx: CanvasRenderingContext2D, dots: Dot[], id: number, x: number, y: number, r?: number) {
    this.ctx = ctx
    this.dots = dots
    this.id = id
    this.x = x
    this.y = y
    this.r = r || Math.floor(Math.random() * 3) + 1
    this.color = 'rgba(255,255,255,' + this.a + ')';
    this.linkColor = 'rgba(255,255,255,' + this.a / 8 + ')';
    this.dir = Math.floor(Math.random() * 140) + 200;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.shadowBlur = this.r * 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  link() {
    if (this.id === 0) return;
    const previousDot1 = this.getPreviousDot(this.id, 1);
    const previousDot2 = this.getPreviousDot(this.id, 2);
    const previousDot3 = this.getPreviousDot(this.id, 3);
    if (!previousDot1) return;
    this.ctx.strokeStyle = this.linkColor;
    this.ctx.moveTo(previousDot1.x, previousDot1.y);
    this.ctx.beginPath();
    this.ctx.lineTo(this.x, this.y);
    if (previousDot2) this.ctx.lineTo(previousDot2.x, previousDot2.y);
    if (previousDot3) this.ctx.lineTo(previousDot3.x, previousDot3.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  move() {
    this.a -= this.aReduction;
    if (this.a <= 0) {
      this.die();
      return
    }
    this.color = 'rgba(255,255,255,' + this.a + ')';
    this.linkColor = 'rgba(255,255,255,' + this.a / 4 + ')';
    this.x = this.x + Math.cos(degToRad(this.dir)) * (this.speed)
    this.y = this.y + Math.sin(degToRad(this.dir)) * (this.speed)

    this.draw();
    this.link();
  }

  die() {
    // const index = this.dots.findIndex(item => item.id === this.id)
    // this.dots.splice(index, 1)
    this.dots[this.id] = null;
    delete this.dots[this.id];
  }

  getPreviousDot(id: number, stepback: number): Dot | null {
    if (id === 0 || id - stepback < 0) return null;
    if (this.dots[id - stepback]) return this.dots[id - stepback];
    return null
  }
}

export default class StarEffect {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  starNum = 80
  stars: Star[]
  dots: Dot[]
  width = 0
  height = 0
  mouseMoving = false
  mouseX = 0
  mouseY = 0
  dotsMinDist = 2
  maxDistFromCursor = 40
  timer: number | null = null
  mouseMoveChecker: number | null = null
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.stars = []
    this.dots = []
  }

  start() {
    this.ctx.strokeStyle = '#fff'
    this.ctx.shadowColor = '#fff'
    this.width = this.canvas.offsetWidth
    this.height = this.canvas.offsetHeight
    this.canvas.setAttribute('width', this.width + '')
    this.canvas.setAttribute('height', this.height + '')
    for (let i = 0; i < this.starNum; i++) {
      this.stars[i] = new Star(this.ctx, i, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))
    }
    this.ctx.shadowBlur = 0
    this.animate()
    window.addEventListener('resize', this.resize.bind(this))
    window.addEventListener('mousemove', this.onMove.bind(this))
  }

  destroy() {
    // window.removeEventListener('resize', this.resize.bind(this))
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.stars.map(star => star.move())
    this.dots.map(dot => dot.move())
    this.drawIfMouseMoving();
    requestAnimationFrame(this.animate.bind(this))
  }

  resize() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      for (let i = 0; i < this.starNum; i++) {
        this.stars[i] = new Star(this.ctx, i, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))
      }
      this.width = this.canvas.offsetWidth
      this.height = this.canvas.offsetHeight
      this.canvas.setAttribute('width', this.width + '')
      this.canvas.setAttribute('height', this.height + '')
    }, 200)
  }

  onMove(e: MouseEvent) {
    this.mouseMoving = true
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    if (this.mouseMoveChecker) clearInterval(this.mouseMoveChecker)
    this.mouseMoveChecker = setTimeout(() => {
      this.mouseMoving = false
    }, 100)
  }

  drawIfMouseMoving() {
    if (!this.mouseMoving) return;
    if (this.dots.length === 0) {
      this.dots[0] = new Dot(this.ctx, this.dots, 0, this.mouseX, this.mouseY);
      this.dots[0].draw();
      return;
    }
    const previousDot = this.getPreviousDot(this.dots.length, 1);
    const prevX = previousDot ? previousDot.x : 0;
    const prevY = previousDot ? previousDot.y : 0;

    const diffX = Math.abs(prevX - this.mouseX);
    const diffY = Math.abs(prevY - this.mouseY);

    if (diffX < this.dotsMinDist || diffY < this.dotsMinDist) return;

    let xVariation = Math.random() > 0.5 ? -1 : 1;
    xVariation = xVariation * Math.floor(Math.random() * this.maxDistFromCursor) + 1;
    let yVariation = Math.random() > 0.5 ? -1 : 1;
    yVariation = yVariation * Math.floor(Math.random() * this.maxDistFromCursor) + 1;
    this.dots[this.dots.length] = new Dot(this.ctx, this.dots, this.dots.length, this.mouseX + xVariation, this.mouseY + yVariation);
    this.dots[this.dots.length - 1].draw();
    this.dots[this.dots.length - 1].link();
  }

  getPreviousDot(id: number, stepback: number): Dot | null {
    if (id === 0 || id - stepback < 0) return null;
    if (this.dots[id - stepback]) return this.dots[id - stepback];
    return null
  }
}

function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}
