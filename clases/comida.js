class Comida {

  constructor(x, y) {
    this.x = x || random(width);
    this.y = y || random(height);
    this.radius = 4;
    this.tiempoCreacion = millis(); // Guardar el tiempo desde que se creó esta comida
  }

  display() {
    fill(255, 243, 0);
    stroke(255, 243, 0);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    noStroke();
  }
}