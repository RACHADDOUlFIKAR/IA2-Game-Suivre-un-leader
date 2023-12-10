# Compte Rendu du Projet - Suivre un  Leader



https://github.com/RACHADDOUlFIKAR/IA2-Game-Suivre-un-leader/assets/97551741/ce370105-83d1-4b94-9738-4fb7d92c8ce7






## Introduction
Le projet consiste en la création d'un système de simulation de comportements véhiculaires utilisant la bibliothèque p5.js. L'objectif principal est d'implémenter plusieurs comportements, tels que le suivi de leader, l'évitement d'obstacles et le comportement wander, tout en offrant la possibilité d'ajuster les paramètres de simulation à l'aide de curseurs.

## Fonctionnalités Principales Implémentées
### 1. Comportement de Suivi de Leader Transparent
Le comportement de suivi de leader a été implémenté, avec une variation transparente lorsqu'un véhicule est devant le leader. Si un véhicule se trouve devant le leader, il s'évade du centre du leader pour éviter la collision.

#### Détails d'Implémentation :

Utilisation de la classe Vehicle pour représenter chaque véhicule.
Intégration du suivi de leader avec la fonction arrive() pour suivre le leader.
Mise en œuvre de la séparation pour éviter les collisions avec les autres véhicules.
Ajout d'une zone d'évasion en utilisant un cercle devant le leader.
### 2. Curseurs pour Ajuster les Paramètres
L'introduction de curseurs offre une approche interactive pour ajuster les paramètres de simulation. Deux curseurs sont inclus : un pour régler la force des comportements et l'autre pour ajuster la vitesse des véhicules.

#### Détails d'Implémentation :

Utilisation de la fonction createSlider() pour créer des curseurs interactifs.
Les curseurs sont positionnés du côté droit de l'écran pour une manipulation facile.
### 3. Changement Dynamique de Comportements vers "Serpent"
Le comportement des suiveurs peut être modifié dynamiquement en appuyant sur "s" . Deux modes sont inclus : suivi transparent du leader et suivi à la queue du leader pour prendre une forme de serpent
#### Détails d'Implémentation :

Utilisation de la fonction keyPressed() pour détecter les frappes de touches.
Changement du mode de suivi en modifiant la variable demo.
### 4. Véhicules avec Comportements Wander
Des véhicules supplémentaires, ayant des comportements wander, évitant les obstacles et étant repoussés par les bords de l'écran, peuvent être ajoutés en appuyant sur la touche "f".

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
### 4. Mode de Débogage
Il est possible d'activer le mode de débogage en appuyant sur la touche "d". Cela active le mode de débogage pour les véhicules et les obstacles.

Détails d'Implémentation :

- Utilisation de la variable `Vehicle.debug` pour activer/désactiver le mode de débogage pour les véhicules.
- Activation du mode de débogage pour les obstacles.

#### Détails d'Implémentation :

Utilisation d'une classe Rectangle pour représenter l'élément visuel.
Ajout d'une fonction show() pour afficher le rectangle serpent.
### Conclusion
Le projet offre une simulation robuste et interactive de comportements véhiculaires, permettant aux utilisateurs de comprendre visuellement les interactions complexes entre les véhicules, les obstacles et les leaders. Les fonctionnalités supplémentaires, telles que la musique de fond et l'ajustement dynamique de la taille du canvas, contribuent à une expérience utilisateur immersive et engageante.
