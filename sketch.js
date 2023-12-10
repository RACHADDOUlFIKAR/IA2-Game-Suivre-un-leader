let target;
let obstacles = [];
let vehicules = [];
let points = [];
let serpentActive = false;
let demo = "default";
let ennemi;
let balles = [];
let stopButton;
let imgVaisseau;
let rectangle;

function preload() {
  imgVaisseau = loadImage('assets/images/R.png');
  backgroundMusic = loadSound('assets/audio/1.mp3');
 
}

function setup() {
   backgroundMusic.setVolume(0.5);
  backgroundMusic.loop();
  let canvasWidth = windowWidth / 1.5; 
  createCanvas(canvasWidth, windowHeight);

  target = createVector(mouseX, mouseY);
  vehicules.push(new Vehicle(100, 100, imgVaisseau));
  obstacles.push(new Obstacle(width / 2, height / 2, 100, color(0, 255, 0)));
  rectangle = new Rectangle(width / 2 - 50, height / 2 - 50, 100, 100);

  // Créer les sliders avec des classes
  forceSlider = createSlider(0, 2, 1, 0.1);
  forceSlider.position(canvasWidth + 10, 30);
  createDiv('Force').position(width + forceSlider.width + 30, 32);

  vitesseSlider = createSlider(0, 10, 4, 0.1);
  vitesseSlider.position(canvasWidth + 10, 70);
  createDiv('Vitesse').position(width + vitesseSlider.width + 30, 72);
  stopButton = createButton('Stop Music');
  stopButton.position(width + 10, 10);
  stopButton.mousePressed(stopMusic);

  
}

function stopMusic() {
  backgroundMusic.stop();
}
function draw() {
  background(0, 0, 0, 100);

  rectangle.x = mouseX - 0/ 2;
  rectangle.y = mouseY - rectangle.height / 2;
  rectangle.show();

  target = createVector(mouseX, mouseY);

  let offset = createVector(-50, 0);
  let newPoint = p5.Vector.add(target, offset);
  points.push(newPoint);
  let forceValue = forceSlider.value();
  let vitesseValue = vitesseSlider.value();
  
  

  switch (demo) {
    case "default":
      for (let i = 0; i < vehicules.length; i++) {
        let targetPoint = newPoint;
        let avoidObstaclesForce = vehicules[i].avoid(obstacles);
        targetPoint.add(avoidObstaclesForce);
        vehicules[i].applyBehaviors(targetPoint, obstacles, vehicules);
        vehicules[i].update();
        vehicules[i].show();
      }
      break;

    case "snake":
      vehicules.forEach((vehicle, index) => {
        let forceArrive;

        if (index == 0) {
          // C'est le 1er véhicule, il suit la cible/souris
          forceArrive = vehicle.arrive(target);
        } else {
          // Les véhicules suivants évitent les obstacles et suivent le véhicule précédent
          let vehiculePrecedent = vehicules[index - 1];
          let forceAvoid = vehicle.avoid(obstacles);
          let forceFollow = vehicle.arrive(vehiculePrecedent.pos, 40);
          forceArrive = p5.Vector.add(forceAvoid, forceFollow);
        }

        // On applique la force au véhicule
        vehicle.applyForce(forceArrive);

        // Activer le comportement de wander lorsque les véhicules touchent le rectangle
        if (serpentActive && rectangle.contains(vehicle)) {
          vehicle.wander();
        }

        // On met à jour la position et on dessine le véhicule
        vehicle.update();
        vehicle.show();
      });
      break;
  }

  vehicules.forEach(v => {
    v.maxForce = forceValue;
    v.maxSpeed = vitesseValue;
    if (!serpentActive && rectangle.contains(v)) {
      // Activer le comportement de wander si le serpent n'est pas actif
      v.wander();
    } else {
      // Revenir vers le point vert si les véhicules ne sont pas dans le rectangle
      let returnForce = v.arrive(newPoint, true);
      v.applyForce(returnForce);
    }
  });
  forceSlider.position(width + 10, 30);
  vitesseSlider.position(width + 10, 70);
  fill(0, 255, 0);
  noStroke();
  circle(newPoint.x, newPoint.y, 16);

  fill(255, 0, 0);
  noStroke();
  let centerX = rectangle.x + rectangle.width / 2;
  let centerY = rectangle.y + rectangle.height / 2;
  circle(centerX, centerY, 32);

  stroke(255);
  line(centerX, centerY, newPoint.x, newPoint.y);

  obstacles.forEach(o => {
    o.show();
  });
  vehicules.forEach(v => {
    // Vérifiez la collision avec chaque obstacle
    obstacles.forEach(o => {
      if (v.checkCollision(o)) {
        // S'il y a collision, ajustez la position pour éviter l'obstacle
        let awayForce = createVector(v.pos.x - o.pos.x, v.pos.y - o.pos.y);
        // Ajustez cette valeur selon vos besoins
        v.applyForce(awayForce);
      }
    });

    // Mise à jour, vérification de la bordure et affichage du véhicule
    v.update();
    v.edges();
    v.show();
  });
}

function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY, random(30, 100), color(0, 255, 0)));
  
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
  } else if (key == "s") {
    serpentActive = !serpentActive;
    demo = "snake";
  } else if (key == "d") {
    Vehicle.debug = !Vehicle.debug;

    // Activer le mode de débogage pour les obstacles
    obstacles.forEach(obstacle => {
      obstacle.debug = !obstacle.debug;
    });
  } else if (key == "f") {
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(random(10, 20), random(height / 2 - 10, height / 2 + 10), imgVaisseau);
      v.maxSpeed = 5;
      v.wander()
      v.color = "purple";
      vehicules.push(v);
    }
  }
}


class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  show() {
    this.x = constrain(this.x, 0, width - this.width);
    this.y = constrain(this.y, 0, height - this.height);

    fill(255, 255, 0, 150);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  contains(vehicle) {
    return (
      vehicle.pos.x > this.x &&
      vehicle.pos.x < this.x + this.width &&
      vehicle.pos.y > this.y &&
      vehicle.pos.y < this.y + this.height
    );
  }
}

