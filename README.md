# Compte Rendu du Projet - Suivre un  Leader || Comportements de Véhicules
## Réalisé par : RACHAD DOUlFIKAR
## Site: EMSI Casablanca



https://github.com/RACHADDOUlFIKAR/IA2-Game-Suivre-un-leader/assets/97551741/a1cdfab7-528b-4f9d-a8a4-25187db4449b




## Introduction
Le projet consiste en la création d'un système de simulation de comportements véhiculaires utilisant la bibliothèque p5.js. L'objectif principal est d'implémenter plusieurs comportements, tels que le suivi de leader, l'évitement d'obstacles et le comportement wander, tout en offrant la possibilité d'ajuster les paramètres de simulation à l'aide de curseurs.

## Fonctionnalités Principales Implémentées
### 1. Comportement de Suivi de Leader Transparent
Le comportement de suivi de leader a été implémenté, avec une variation transparente lorsqu'un véhicule est devant le leader. Si un véhicule se trouve devant le leader, il s'évade du centre du leader pour éviter la collision.


  `
  
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
      `
    

#### Détails d'Implémentation :

Utilisation de la classe Vehicle pour représenter chaque véhicule.
Intégration du suivi de leader avec la fonction arrive() et applyBehaviors() pour suivre le leader.

```javascript
applyBehaviors(target, obstacles, vehicules) {

  this.avoidEdges();
  
  // la logique pour éviter les obstacles
  let avoidForceObstacles = this.avoid(obstacles);
  
  avoidForceObstacles.mult(0.9);
  this.applyForce(avoidForceObstacles);
  
  // la logique pour suivre la cible
  
  let seekForce = this.arrive(target);
  seekForce.mult(0.2);
  this.applyForce(seekForce);
  
  // Ajoutez pour la séparation des véhicules
  let separationForce = this.separate(vehicules);
  separationForce.mult(0.9);
  this.applyForce(separationForce);
  
}
arrive(target) {
  return this.seek(target, true);
  }
``` 

Mise en œuvre de la séparation pour éviter les collisions avec les autres véhicules.
Ajout d'une zone d'évasion en utilisant un cercle devant le leader.
### 2. Évitement d'Obstacles
Tous les véhicules ont la capacité d'éviter les obstacles sur leur trajectoire. Lorsqu'un obstacle est détecté, les véhicules ajustent leur trajectoire pour éviter une collision.

Détails d'Implémentation :

- Utilisation de la fonction `avoid()` dans la classe `Vehicle` pour détecter et éviter les obstacles.
  
  ```
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
  
  ```

- Vérification de la collision avec chaque obstacle et ajustement de la position pour éviter la collision.

### 3. Curseurs pour Ajuster les Paramètres
L'introduction de curseurs offre une approche interactive pour ajuster les paramètres de simulation. Deux curseurs sont inclus : un pour régler la force des comportements et l'autre pour ajuster la vitesse des véhicules.

#### Détails d'Implémentation :

```
forceSlider = createSlider(0, 2, 1, 0.1);
forceSlider.position(canvasWidth + 10, 30);
createDiv('Force').position(width + forceSlider.width + 30, 32);
vitesseSlider = createSlider(0, 10, 4, 0.1);
vitesseSlider.position(canvasWidth + 10, 70);
createDiv('Vitesse').position(width + vitesseSlider.width + 30, 72);
  ```

Utilisation de la fonction createSlider() pour créer des curseurs interactifs.
Les curseurs sont positionnés du côté droit de l'écran pour une manipulation facile.
### 4. Changement Dynamique de Comportements vers "Serpent"
Le comportement des suiveurs peut être modifié dynamiquement en appuyant sur "s" . Deux modes sont inclus : suivi transparent du leader et suivi à la queue du leader pour prendre une forme de serpent

`case "snake":

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
      `
      
    
     

#### Détails d'Implémentation :

Utilisation de la fonction keyPressed() pour détecter les frappes de touches.
Changement du mode de suivi en modifiant la variable demo.
### 5. Véhicules avec Comportements Wander
Des véhicules supplémentaires, ayant des comportements wander, évitant les obstacles, peuvent être ajoutés en appuyant sur la touche "f" et étant repoussés par les bords de l'écran.

`  

    for (let i = 0; i < 10; i++) {
    
      let v = new Vehicle(random(10, 20), random(height / 2 - 10, height / 2 + 10), imgVaisseau);
      v.maxSpeed = 5;
      v.wander()
      v.color = "purple";
      vehicules.push(v);
      
    }
    `

#### Détails d'Implémentation :

Utilisation du comportement wander pour des véhicules spécifiques.
Ajout d'une fonctionnalité de répulsion des bords de l'écran .
# Améliorations Apportées
### 1. Musique de Fond
Une fonctionnalité de musique de fond a été ajoutée pour améliorer l'expérience utilisateur. La musique peut être arrêtée à l'aide d'un bouton dédié.

#### Détails d'Implémentation :

Utilisation de la fonction loadSound() pour charger la musique.
Intégration d'un bouton pour arrêter la musique.

### 2. Ajustement Dynamique de la Taille du Canvas
Le projet a été optimisé pour s'adapter dynamiquement à la taille de la fenêtre du navigateur, assurant une expérience utilisateur fluide sur différents appareils.

#### Détails d'Implémentation :

Ajustement dynamique de la largeur du canvas en fonction de la fenêtre.
### 3. Mode de Débogage
Il est possible d'activer le mode de débogage en appuyant sur la touche "d". Cela active le mode de débogage pour les véhicules et les obstacles.

Détails d'Implémentation :

- Utilisation de la variable `Vehicle.debug` pour activer/désactiver le mode de débogage pour les véhicules.
- Activation du mode de débogage pour les obstacles.

#### Détails d'Implémentation :

Utilisation d'une classe Rectangle pour représenter l'élément visuel.
Ajout d'une fonction show() pour afficher le rectangle serpent.
### Conclusion
Le projet offre une simulation robuste et interactive de comportements véhiculaires, permettant aux utilisateurs de comprendre visuellement les interactions complexes entre les véhicules, les obstacles et les leaders. Les fonctionnalités supplémentaires, telles que la musique de fond et l'ajustement dynamique de la taille du canvas, contribuent à une expérience utilisateur immersive et engageante.
