class Obstacle {
  constructor(x, y, radius, obstacleColor) {
    this.pos = createVector(x, y);
    this.r = radius;
    this.color = obstacleColor || color(255, 0, 0);
  }

  show() {
    fill(this.color);

    if (this.debug) {
      // Dessinez le mode de débogage pour les obstacles, par exemple, un contour
      noFill();
      stroke(255);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else {
      // Dessinez l'obstacle normalement
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
} 

