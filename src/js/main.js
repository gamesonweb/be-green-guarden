import Player from './player.js';
import Map from './map.js';
import Sounds from './sounds.js';
import Dialogue from './Dialogue.js';


let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);
let scene;
let player;
let camera;
let map;
let isPlayerTakingDamage = false;
let dialogue = new Dialogue();
let ruee = false;
let fpsMonitor = document.getElementById("fps");
let camMaxZ
let camMinZ
let camMaxY
let camMinY
let checkpoint;
let skybox;
let spawn;
let spawnpoint;
let sounds
let preset = {
    "fog": "#6b6e6b",
    "material_block_A": "cobblestone.png",
    "material_block_B": "clay.png",
    "material_plane_A": "clay.png",
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
    //The goal distance of camera from target
    // camera.radius = 50;
    // The goal height of camera above local origin (centre) of target
    // camera.heightOffset = 1;
    // The goal rotation of camera around local origin (centre) of target in x y plane
    // camera.rotationOffset = 90;
    //Acceleration of camera in moving from current to goal position
    // camera.cameraAcceleration = 0.1
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
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
        /*
        //console.log(this.isJumping)
        if (player.isJumping) {
            // collision dectected on the player
            player.body.onCollideObservable.addOnce(function () {
                console.log("Jumping collision")
                player.isJumping = false;
                player.jumpVelocity = 5;
            });
        }
         */
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
        player.jumpVelocity -= 10 * engine.getDeltaTime() / 1000;
    });
}

function createSun() {
    let sunCity = new BABYLON.PointLight("SunnyCity", new BABYLON.Vector3(50, 200, -200), scene);
    let sun = new BABYLON.PointLight("Sunny", new BABYLON.Vector3(50, 200, 0), scene);
    sun.intensity = 2;
    //light1.radius = 10;
    //light1.range = 10;
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
    //light1.radius = 10;
    //light1.range = 10;
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
    player.body.position = new BABYLON.Vector3(spawnpoint._x, spawnpoint._y, spawnpoint._z)
    checkpoint = spawnpoint;
    let textDiv = document.getElementById("youLoseText");
    // Show the text
    textDiv.style.visibility = "visible";
    player.fillEnergy();
    camera.position = new BABYLON.Vector3(30, 5, -247);
    camera.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
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

    //city = new City(scene);
    //spawn = city.generate(-250, 14.5, 10)

    skybox = map.createSkyBox();
    // Player creation
    player = new Player(spawn, 20, 5, 0.05, scene, engine);
    camMinZ = -250
    camMaxZ = 100
    camMinY = 5
    camMaxY = 60
    checkpoint = Object.assign({}, spawn);
    spawnpoint =  Object.assign({}, spawn);
    cameraSetup();

    // Import robot model

    BABYLON.SceneLoader.ImportMesh("", "src/models/mech_drone/", "scene.gltf", scene, function (meshes) {
        //scene.createDefaultLight(true);
        // make the object bigger
        let pointLight = new BABYLON.PointLight("PointLight", new BABYLON.Vector3(0, 0, 0), scene);
        pointLight.intensity = 1;
        pointLight.range = 2;
        pointLight.radius = 2;

        meshes[0].scaling = new BABYLON.Vector3(3.3, 3.3, 3.3);
        meshes[0].position.y = -0.8;
        meshes[0].parent = player.body;
        pointLight.parent = player.body;
    });


    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var image = new BABYLON.GUI.Image("but", "src/expressions/mech_drone_question.png");
    var text = new BABYLON.GUI.TextBlock("text", dialogue.tuto[0]);
    text.color = "white";
    image.width = "150px";
    image.height = "150px";
    image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(image);
    advancedTexture.addControl(text);

    initMovementHandler(scene);

    scene.registerAfterRender(function () {
        scene.meshes.forEach(function (mesh) {
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
                    //mesh.dispose();
                }
            } else if (mesh.name === "collectible_energy") {
                if (mesh.intersectsMesh(player.body, true) && mesh.isEnabled()) {
                    console.log("Intersection detected with mesh " + mesh.name);
                    player.fillEnergy();
                    map.trashBar.fillTrash();
                    sounds.pickup_trash.play();
                    mesh.setEnabled(false);
                    //mesh.dispose();
                }
            } else if (mesh.name === "spike") {
                if (mesh.intersectsMesh(player.body, true)) {
                    console.log("Intersection detected with mesh " + mesh.name);

                    let hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
                    hitMaterial.diffuseColor = new BABYLON.Color3(100, 0.5, 0);
                    player.body.material = hitMaterial;
                    player.body.visibility = 0.5;
                    player.body.position = new BABYLON.Vector3(checkpoint._x, checkpoint._y, checkpoint._z)
                    player.fillEnergy();

                    if (!isPlayerTakingDamage) {
                        sounds.take_damage.play();
                        isPlayerTakingDamage = true;
                        setTimeout(function () {
                            let hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
                            hitMaterial.diffuseColor = new BABYLON.Color3(100, 100, 100);
                            player.body.material = hitMaterial;
                            player.body.visibility = 0.1
                            isPlayerTakingDamage = false;
                        }, 500);
                    }
                }
            } else if (mesh.name === "checkpoint") {
                if (mesh.intersectsMesh(player.body, true)) {
                    if (!mesh.metadata.taken) {
                        console.log("Intersection detected with mesh " + mesh.name);
                        checkpoint = Object.assign({}, mesh.metadata.pos)
                        sounds.checkpoint.play()
                        mesh.metadata.taken = true;
                    }

                }
            } else if (mesh.name === "manhole_cover") {
                if (mesh.intersectsMesh(player.body, true)) {
                    console.log("Intersection detected with" + mesh.name);
                    //mesh.dispose();
                    player.body.position.y += -3;
                    scene.fogColor = BABYLON.Color3.FromHexString("#124344");
                    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
                    scene.fogDensity = 0.001;
                    scene.fogStart = 20.0;
                    scene.fogEnd = 22.0;
                    player.fillEnergy();
                    camMinY = -150;
                    skybox.material.reflectionTexture = new BABYLON.CubeTexture("src/skyboxs/" + "purple_cave/purple_cave", scene);
                }
            }
        });
    });

    player.body.onCollideObservable.add((collidedMesh) => {
        if (collidedMesh.name === "exitDoor") {
            console.log("Collided with " + collidedMesh.name);
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
    fpsMonitor.innerHTML = engine.getFps().toFixed() + " fps";

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


