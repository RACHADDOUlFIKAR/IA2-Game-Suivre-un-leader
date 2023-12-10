function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

  
  class Vehicle {
  static debug = false;
  
  
  constructor(x, y, imageVaisseau) {
  this.imageVaisseau = imageVaisseau;
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxSpeed = 4;
  this.maxForce = 0.7;
  this.color = "white";
  this.dureeDeVie = 5;
  this.r_pourDessin = 16;
  this.r = this.r_pourDessin * 3;
  this.largeurZoneEvitementDevantVaisseau = this.r / 2;
  this.distanceAhead = 30;
  this.path = [];
  this.pathMaxLength = 30;
  this.distanceCercleWander = 80;
    this.wanderRadius = 40;
    this.wanderTheta = 0;
    this.displaceRange = 0.3
  }
  checkCollision(obstacle) {
    // Vérifiez la collision avec l'obstacle
    let distance = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);
    return distance < this.r + obstacle.r;
  }
  align(leader) {
  return this.seek(leader.pos);
  }
  
  follow(previousVehicle) {
  let target = createVector(previousVehicle.pos.x, previousVehicle.pos.y);
  let desiredSeparation = 30;
  let offset = p5.Vector.sub(target, this.pos);
  let distance = offset.mag();
  
  if (distance < desiredSeparation) {
  offset.setMag(map(distance, 0, desiredSeparation, 0, this.maxSpeed));
  offset.mult(-1);
  let steer = p5.Vector.sub(offset, this.vel);
  steer.limit(this.maxForce);
  return steer;
  } else {
  return this.arrive(target);
  }
  }
  
  applyBehaviors(target, obstacles, vehicules) {
  this.avoidEdges();
  // Ajoutez la logique pour éviter les obstacles
  let avoidForceObstacles = this.avoid(obstacles);
  avoidForceObstacles.mult(0.9);
  this.applyForce(avoidForceObstacles);
  
  // Ajoutez la logique pour suivre la cible
  let seekForce = this.arrive(target);
  seekForce.mult(0.2);
  this.applyForce(seekForce);
  
  // Ajoutez la logique pour la séparation des véhicules
  let separationForce = this.separate(vehicules);
  separationForce.mult(0.9);
  this.applyForce(separationForce);
  }
  
  getObstacleLePlusProche(obstacles) {
  let plusPetiteDistance = 100000000;
  let obstacleLePlusProche = undefined;
  
  obstacles.forEach(o => {
  const distance = this.pos.dist(o.pos);
  
  if (distance < plusPetiteDistance) {
  plusPetiteDistance = distance;
  obstacleLePlusProche = o;
  }
  });
  
  return obstacleLePlusProche;
  }
  
  
  avoid(obstacles) {
  let ahead = this.vel.copy();
  ahead.normalize();
  ahead.mult(this.distanceAhead);
  let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);
  
  if (Vehicle.debug) {
  this.drawVector(this.pos, ahead, color(255, 0, 0));
  fill("lightgreen");
  noStroke();
  circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
  }
  
  let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);
  
  if (obstacleLePlusProche == undefined) {
  return createVector(0, 0);
  }
  
  let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
  
  if (distance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
  let force = p5.Vector.sub(pointAuBoutDeAhead, obstacleLePlusProche.pos);
  force.setMag(this.maxSpeed);
  force.sub(this.vel);
  force.limit(this.maxForce);
  return force;
  } else {
  return createVector(0, 0);
  }
  }
  
  
  separate(boids) {
  let desiredseparation = 50;
  let steer = createVector(0, 0, 0);
  let count = 0;
  
  for (let i = 0; i < boids.length; i++) {
  let other = boids[i];
  let d = p5.Vector.dist(this.pos, other.pos);
  
  if (d > 0 && d < desiredseparation) {
  let diff = p5.Vector.sub(this.pos, other.pos);
  diff.normalize();
  diff.div(d);
  steer.add(diff);
  count++;
  }
  }
  if (count > 0) {
  steer.div(count);
  }
  
  if (steer.mag() > 0) {
  steer.normalize();
  steer.mult(this.maxSpeed);
  steer.sub(this.vel);
  steer.limit(this.maxForce);
  }
  return steer;
  }
  
  arrive(target) {
  return this.seek(target, true);
  }
  
  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }
  
  
  applyForce(force) {
  this.acc.add(force);
  }
  
  update() {
  this.vel.add(this.acc);
  this.vel.limit(this.maxSpeed);
  this.pos.add(this.vel);
  this.acc.set(0, 0);
  this.ajoutePosAuPath();
  this.dureeDeVie -= 0.01;
  }
  
  ajoutePosAuPath() {
  this.path.push(this.pos.copy());
  if (this.path.length > this.pathMaxLength) {
  this.path.shift();
  }
  }
  
  show() {
  this.drawPath();
  this.drawVehicle();
  }
  avoidEdges() {
  let desired = null;
  
  if (this.pos.x < this.r) {
  desired = createVector(this.maxSpeed, this.vel.y);
  } else if (this.pos.x > width - this.r) {
  desired = createVector(-this.maxSpeed, this.vel.y);
  }
  
  if (this.pos.y < this.r) {
  desired = createVector(this.vel.x, this.maxSpeed);
  } else if (this.pos.y > height - this.r) {
  desired = createVector(this.vel.x, -this.maxSpeed);
  }
  
  if (desired !== null) {
  desired.normalize();
  desired.mult(this.maxSpeed);
  let steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  this.applyForce(steer);
  }
  }
  
  drawVehicle() {
  stroke(255);
  strokeWeight(2);
  fill(this.color);
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.vel.heading());
  push();
  imageMode(CENTER);
  rotate(PI / 2);
  image(this.imageVaisseau, 0, 0, this.r_pourDessin * 2, this.r_pourDessin * 2);
  pop();
  pop();
  this.drawVector(this.pos, this.vel, color(255, 0, 0));
  
  if (Vehicle.debug) {
  stroke(255);
  noFill();
  circle(this.pos.x, this.pos.y, this.r);
  }
  }
  
  drawPath() {
  stroke(255);
  noFill();
  strokeWeight(1);
  fill(this.color);
  this.path.forEach((p, index) => {
  if (!(index % 5)) {
  circle(p.x, p.y, 1);
  }
  });
  }
  wander() {
    // point devant le véhicule
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(this.distanceCercleWander);
    wanderPoint.add(this.pos);

    if (Vehicle.debug) {
      // on le dessine sous la forme d'une petit cercle rouge
      fill(255, 0, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 8);

      // Cercle autour du point
      noFill();
      stroke(255);
      circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);

      // on dessine une lige qui relie le vaisseau à ce point
      // c'est la ligne blanche en face du vaisseau
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }
    // On va s'occuper de calculer le point vert SUR LE CERCLE
    // il fait un angle wanderTheta avec le centre du cercle
    // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
    // + cet angle
    let theta = this.wanderTheta + this.vel.heading();

    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);

    // maintenant wanderPoint c'est un point sur le cercle
    wanderPoint.add(x, y);

    if (Vehicle.debug) {
      // on le dessine sous la forme d'un cercle vert
      fill("green");
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 16);

      // on dessine le vecteur desiredSpeed qui va du vaisseau au point vert
      stroke("yellow");
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }
    // On a donc la vitesse désirée que l'on cherche qui est le vecteur
    // allant du vaisseau au cercle vert. On le calcule :
    // ci-dessous, steer c'est la desiredSpeed directement !
    let desiredSpeed = wanderPoint.sub(this.pos);

    // Ce que dit Craig Reynolds, c'est que uniquement pour ce
    // comportement, la force à appliquer au véhicule est
    // desiredSpeed et pas desiredSpeed - vitesse actuelle !
    let force = desiredSpeed;

    force.setMag(this.maxForce);
    this.applyForce(force);

    // On déplace le point vert sur le cerlcle (en radians)
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
  }
  
  drawVector(pos, v, color) {
  push();
  strokeWeight(3);
  stroke(color);
  line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
  let arrowSize = 5;
  translate(pos.x + v.x, pos.y + v.y);
  rotate(v.heading());
  translate(-arrowSize / 2, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
  }
  
  edges() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1; // Inverser la direction
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
  
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
  }
  