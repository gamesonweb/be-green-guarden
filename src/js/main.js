import Player from './player.js';
import Map from './map.js';
import Sounds from './sounds.js';
import Dialogue from './dialogue.js';

let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);
let scene;
let dialogueActuel = ""
let dialog= new Dialogue() 
let cpt = 0;
let player;
let camera;
let map;
let spawnpoint;
let isPlayerTakingDamage = false;
let ruee = false;
let fpsMonitor = document.getElementById("numberTrash");
let camMaxZ
let camMinZ
let camMaxY
let camMinY
let checkpoint;
let skybox;
let firstTrash = true;
let spawn;
let confirmedTrash = 0  
let collectedTrash = 0;
let sounds
let hasStartedPlaying = false;
let preset = {
    "fog": "#6b6e6b",
    "material_block_A": "cobble.jpg",
    "material_block_B": "cobblestone.png",
    "material_plane_A": "cobblestone.png",
    "material_spike_A": "bloody_spike.jpg",
    "skybox_texture": "normal/skybox",
    "light_color": "#1351FF"
};

let cameraSetup = function () {
    //var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(30, 5, -247), scene);
    //camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3.Zero(), scene);
    camera.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
    camera.viewport = new BABYLON.Viewport(-0.25, -0.25, 1.5, 1.5);
    // This attaches the camera to the canvas
    //camera.attachControl(canvas, true);
    //camera.lockedTarget = player.body;
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
}

let cameraMovementCheck = function () {
    /*
     - - - - - - - - - - -| - - - - - - - - - - - | - - - - - - - - - - -
    [   no cam movement  ][   cam follow player   ][   no cam movement   ]
                          |          |            |
                          |          |            |
                        z= -8      z= 0         z= +8
     */

    if (player.body.position.z > camMinZ && player.body.position.z < camMaxZ) {
        camera.position.z = player.body.position.z;
    }

    if (player.body.position.y > camMinY && player.body.position.y < camMaxY) {
        camera.position.y = player.body.position.y;
    }
}

let initMovementHandler = function (scene) {
    // Create the action manager for the scene
    scene.actionManager = new BABYLON.ActionManager(scene);

    // Register the keyboard events OnKeyDownTrigger
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        if (hasStartedPlaying == false){
            player.bar = player.initEnergyBar();
            hasStartedPlaying = true;
        }
        switch (evt.sourceEvent.key) {
            case "w":
                if (player.canDash && !player.isDashing) {
                    //player.dashVelocity = 5;
                    player.isDashing = true;
                    setTimeout(function () {
                        player.isDashing = false;
                        player.canDash = true;
                    }, 1000);
                    setTimeout(function () {
                        ruee = false;
                    }, 80);
                    ruee = true;
                    player.canDash = false;
                }
                break;
            case " ":
                if (!player.isJumping) {
                    //player.body.position.y += 0.01;
                    player.isJumping = true;
                }
                console.log("spacebar")
                break;
            case "z":
                console.log("throw the hook")
                break;
            case "ArrowLeft":
                console.log("ArrowLeft")
                player.isMovingLeft = true;
                player.isLookingRight = false;
                player.doRotation("left");
                player.lastDirection = "ArrowLeft";
                player.body.rotation.y = Math.PI;
                break;
            case "ArrowRight":
                console.log("ArrowRight")
                player.isMovingRight = true;
                player.isLookingLeft = false;
                player.doRotation("right");
                player.lastDirection = "ArrowRight";
                player.body.rotation.y = 0;
                break;
        }
    }));

    // Register the keyboard events OnKeyUpTrigger
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        switch (evt.sourceEvent.key) {
            case "w":
                player.isDashing = false;
                break;
            case " ":
                player.isJumping = false;
                console.log("space release")
                break;
            case "ArrowLeft":
                player.isMovingLeft = false;
                console.log("q release")
                break;
            case "ArrowRight":
                player.isMovingRight = false;
                console.log("d release")
                break;
        }
    }));


    // Update the cube's position every frame
    scene.onAfterRenderObservable.add(function () {
        if (player.isMovingRight) {
            player.body.moveWithCollisions(new BABYLON.Vector3(0, 0, player.movementSpeed))
        }
        if (player.isMovingLeft) {
            player.body.moveWithCollisions(new BABYLON.Vector3(0, 0, -player.movementSpeed))
        }
        if (ruee) {
            switch (player.lastDirection) {
                case "ArrowRight":
                    // player.dashVelocity = 100 * engine.getDeltaTime() / 1000;
                    player.body.moveWithCollisions(new BABYLON.Vector3(0, 0, player.dashVelocity * engine.getDeltaTime() / 400))
                    setTimeout(function () {
                        player.isDashing = false
                        player.isDashing = false
                    }, 50);

                    break;
                case "ArrowLeft":
                    // player.dashVelocity = 100 * engine.getDeltaTime() / 1000;
                    player.body.moveWithCollisions(new BABYLON.Vector3(0, 0, -player.dashVelocity * engine.getDeltaTime() / 400))
                    //player.dashVelocity -= 10 * engine.getDeltaTime() / 1000;
                    setTimeout(function () {
                        player.isDashing = false
                    }, 50);
                    break;
            }
        }  
        player.body.moveWithCollisions(new BABYLON.Vector3(0, player.jumpVelocity * engine.getDeltaTime() / 1000, 0));
        if (player.jumpVelocity > -20) {  // change this value to change the gravity
            
            player.jumpVelocity -= 10 * engine.getDeltaTime() / 1000;
        }

    });
}

function createSun() {
    let sunCity = new BABYLON.PointLight("SunnyCity", new BABYLON.Vector3(50, 200, -200), scene);
    let sun = new BABYLON.PointLight("Sunny", new BABYLON.Vector3(50, 200, 0), scene);
    sun.intensity = 2;
    sun.setEnabled(true);

    let sunSphere = BABYLON.MeshBuilder.CreateSphere("Sphere0", {segments: 16, diameter: 4}, scene);
    sunSphere.material = new BABYLON.StandardMaterial("red", scene);
    sunSphere.material.diffuseColor = (1, 1, 1);
    sunSphere.material.specularColor = new BABYLON.Color3(1, 1, 1);
    sunSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    sun.diffuse = new BABYLON.Color3(1, 1, 1);
    sun.specular = new BABYLON.Color3(1, 1, 1);
    sunSphere.position = sun.position;

    sunCity.intensity = 2;
    sunCity.setEnabled(true);

    let sunCitySphere = BABYLON.MeshBuilder.CreateSphere("Sphere00", {segments: 16, diameter: 4}, scene);
    sunCitySphere.material = new BABYLON.StandardMaterial("red", scene);
    sunCitySphere.material.diffuseColor = (1, 1, 1);
    sunCitySphere.material.specularColor = new BABYLON.Color3(1, 1, 1);
    sunCitySphere.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    sunCity.diffuse = new BABYLON.Color3(1, 1, 1);
    sunCity.specular = new BABYLON.Color3(1, 1, 1);
    sunCitySphere.position = sunCity.position;
}

function createFog(preset, scene) {
    let fogColor = BABYLON.Color3.FromHexString(preset.fog);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = fogColor;
    scene.fogDensity = 0.005;
    scene.fogStart = 60.0;
    scene.fogEnd = 80.0;
} 


let playDeath = function () {
    player.body.position = new BABYLON.Vector3(checkpoint._x, checkpoint._y, checkpoint._z)
    //createFog(preset, scene);
    //checkpoint = spawnpoint;
    let textDiv = document.getElementById("youLoseText");
    // Show the text
    textDiv.style.visibility = "visible";
    player.fillEnergy();
    //camera.position = new BABYLON.Vector3(30, 5, -247);
    //camera.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
    sounds.lose_game.play();
    scene.meshes.forEach(function (mesh)  {
        if (mesh.name === "checkpoint"){
            mesh.metadata.taken = false;
        }
        if (mesh.name === "collectible_reload_dash"){
            mesh.setEnabled(true);
        }
        if (mesh.name === "collectible_energy"){
            mesh.setEnabled(true);
        }
    })
    // Hide the text after 5 seconds
    setTimeout(function() {
        textDiv.style.visibility = "hidden";
    }, 3000);
}




let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    scene.createDefaultEnvironment({createGround: false, createSkybox: false})
    scene.clearColor = BABYLON.Color3.White();
    scene.ambientColor = BABYLON.Color3.FromHexString("#3C69E7");
    scene.autoClear = false; // Color buffer
    scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    scene.freezeActiveMeshes();
    scene.blockMaterialDirtyMechanism = true;

    // load level music and play it indefinitely
    sounds = new Sounds();

    createFog(preset, scene);

    createSun();


    map = new Map(scene, preset, -90);
    map.generate(-68, -1, 10, "map");
    spawn = map.generate(-250, 14.5, 10, "city");


    skybox = map.createSkyBox();
    // Player creation
    player = new Player(spawn, 20, 5, 0.05*120/60, scene, engine);
    camMinZ = -250
    camMaxZ = 150
    camMinY = 5
    camMaxY = 60
    checkpoint = Object.assign({}, spawn);
    spawnpoint =  Object.assign({}, spawn);
    cameraSetup();

    // Import robot model
    BABYLON.SceneLoader.ImportMesh("", "src/models/mech_drone/", "scene.glb", scene, function (meshes) {
        // make the object bigger
        let pointLight = new BABYLON.PointLight("PointLight", new BABYLON.Vector3(0, 0, 0), scene);
        pointLight.intensity = 1;
        pointLight.range = 2;
        pointLight.radius = 2;
        // use the basic animation of the model
        meshes[0].animations = meshes[0].animations.slice(0, 1);

        meshes[0].scaling = new BABYLON.Vector3(3.3, 3.3, 3.3);
        meshes[0].position.y = -0.8;
        meshes[0].parent = player.body;
        pointLight.parent = player.body;
    }); 

    initMovementHandler(scene);

    scene.registerAfterRender(function () {
        scene.meshes.forEach(function (mesh) {
            if (mesh.name === "nextDiag") {
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    mesh.setEnabled(false);
                    console.log("nextDiag");
                    dialogueActuel = dialog.dialogues[cpt++];
                    let text = document.getElementById("text");
                    text.innerHTML = dialogueActuel;
                    // Show the text
                    //text.style.visibility = "visible";
                    //setTimeout(function() {
                    //    text.style.visibility = "hidden";
                    //}, 5000);
                    
                }
            }
            if (mesh.name === "start_drift") {
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    mesh.setEnabled(false);
                    console.log("start_drift");
                    sounds.drift.play();
                }
            }
            if (mesh.name === "fight") {
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    mesh.setEnabled(false);
                    console.log("fight");
                    dialogueActuel = dialog.dialogues[cpt++];
                    let text = document.getElementById("text");
                    text.innerHTML = "Arrête c'est pas bien";
                    player.isInvincible = true;
                    // Show the text
                    setTimeout(function() {
                        text.innerHTML = "Mr. Drifter : oui tu as raison jarrete";
                        setTimeout(function() {
                            sounds.drift.stop()
                            // Start joy
                            // print FIN
                            scene.fogColor = BABYLON.Color3.FromHexString("#ffffff");
                            scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                            scene.fogDensity = 0.001;
                            scene.fogStart = 200.0;
                            scene.fogEnd = 200.0;
                            console.log( scene.particleSystems);
                            scene.particleSystems.forEach(t => {
                                t.stop();
                            })
                            setTimeout(function() {
                                sounds.victory.play()
                                document.getElementById("theEnd").style.visibility = "visible";
                            }, 1000);
                        }, 2000);
                    }, 8000);

                }
            }
            if (mesh.name === "collectible_reload_dash") {
                // Rotation of dash boost
                mesh.rotate(new BABYLON.Vector3(0, 1, 0), 0.05, BABYLON.Space.LOCAL);
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    console.log("Intersection detected with magic stone " + mesh.name);
                    sounds.pickup_dash_boost.play();
                    player.canDash = true;
                    mesh.setEnabled(false);
                    setTimeout(function (){
                        mesh.setEnabled(true);
                    }, 500)
                }
            } else if (mesh.name === "collectible_energy") {
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    console.log("Intersection detected with mesh " + mesh.name);
                    player.fillEnergy();
                    map.trashBar.fillTrash();
                    sounds.pickup_trash.play();
                    mesh.setEnabled(false);
                    collectedTrash += 1;
                }
            } else if (mesh.name === "spike") {
                if (mesh.intersectsMesh(player.body, true)) {
                    console.log("Intersection detected with mesh " + mesh.name);

                    let hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
                    hitMaterial.diffuseColor = new BABYLON.Color3(100, 0.5, 0);
                    player.body.material = hitMaterial;
                    player.body.visibility = 0;
                    player.body.position = new BABYLON.Vector3(checkpoint._x, checkpoint._y, checkpoint._z)
                    player.fillEnergy();
                    collectedTrash = confirmedTrash;

                    scene.meshes.forEach(function (mesh)  {
                        if (mesh.name === "collectible_energy"){
                            mesh.setEnabled(true);
                        }
                    })

                    if (!isPlayerTakingDamage) {
                        sounds.take_damage.play();
                        isPlayerTakingDamage = true;
                        setTimeout(function () {
                            let hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
                            hitMaterial.diffuseColor = new BABYLON.Color3(100, 100, 100);
                            player.body.material = hitMaterial;
                            player.body.visibility = 0
                            isPlayerTakingDamage = false;
                        }, 500);
                    }
                }
            } else if (mesh.name === "checkpoint") {
                if (mesh.intersectsMesh(player.body, true)) {
                    if (!mesh.metadata.taken) {
                        checkpoint = Object.assign({}, mesh.metadata.pos)
                        sounds.checkpoint.play()
                        player.fillEnergy();
                        mesh.metadata.taken = true;
                        confirmedTrash = collectedTrash;
                    }

                }
            } else if (mesh.name === "manhole_cover") {
                if (mesh.intersectsMesh(player.body, true)) {
                    player.body.position.y += -3;
                    scene.fogColor = BABYLON.Color3.FromHexString("#124344");
                    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
                    scene.fogDensity = 0.001;
                    scene.fogStart = 20.0;
                    scene.fogEnd = 22.0;
                    player.fillEnergy();
                    camMinY = -150
                    skybox.material.reflectionTexture = new BABYLON.CubeTexture("src/skyboxs/" + "purple_cave/purple_cave", scene);
                }
            }
        });
    });

    player.body.onCollideObservable.add((collidedMesh) => {
        if (collidedMesh.name === "exitDoor") {
            // Check if it is the last door before the end of cave
            if (collidedMesh.metadata == "{X: 10 Y: 5 Z: 12}" ){
                console.log("End of cave door")
                //camera.rotation = new BABYLON.Vector3(Math.PI / 8, Math.PI / 2, 0)
                let fogColor = BABYLON.Color3.FromHexString(preset.fog);
                scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                scene.fogColor = fogColor;
                scene.fogDensity = 0.03;
                scene.fogStart = 60.0;
                scene.fogEnd = 80.0;
                camera.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                camera.viewport = new BABYLON.Viewport(-0.25, -0.25, 1.5, 1.5);
                camMinY = 3
            }

            console.log("Collided with " + collidedMesh.name + " " + collidedMesh.metadata);
            player.body.position = collidedMesh.metadata;
            camera.position = new BABYLON.Vector3(30, camera.position.y + 16, -8);
            sounds.open_close_door.play();
        }
    });

    return scene;
};

scene = createScene();


engine.runRenderLoop(function () {
    cameraMovementCheck();
    fpsMonitor.innerHTML = collectedTrash + "/" + map.numberTrash + " trash collected";

    if (player.hasNoEnergy()) {
        console.log("player has no energy !")
        playDeath();
    }

    player.body.onCollideObservable.addOnce(function () {
        if (player.isJumping) {
            console.log("Jumping collision AAA")
            player.isJumping = false;
            player.jumpVelocity = 6;
        }
    });


    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});


