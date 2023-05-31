import Collectible from "./collectible.js";
import TrashBar from './trashBar.js';
import Dialogue from './dialogue.js';

export default class Map {

    constructor(scene, preset, y) {
        this.scene = scene;
        this.trashBar = null;
        this.preset = preset;
        this.cpt = 0;
        this.collected = 0;
        this.meshIndex = 0;
        this.dialog = new Dialogue();
        this.dialogueActuel = null;
        //this.skybox = this.createSkyBox();
        this.numberTrash = 0;

        this.doorDestinations = {
            // The index is the order of generation of the doors (begins by the bottom-left and end tpo-right)
            // So index 0 correspond of the first generated door (bottom-left) and the index n correspond of the last generated door (top-right of the map)
            0: new BABYLON.Vector3(10, 22 + y, -40),   //x, y, z
            1: new BABYLON.Vector3(10, 34 + y, -37),
            2: new BABYLON.Vector3(10, 54 + y, -36),
            3: new BABYLON.Vector3(10, 74 + y, -37),
            4: new BABYLON.Vector3(10, 50 + y + 38, -37),
            5: new BABYLON.Vector3(10, 5, 12),
        };
        this.destinationIndex = 0;

        /* CITY */

        // Boss level import
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "buildify_city_build_modelboss_1.0.glb", scene, function (meshes) {
            meshes[0].position.y = 0;
            meshes[0].position.z = 180;
            meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            meshes[0]._freeze();
            meshes[0].disableEdgesRendering();
            meshes[0].freezeWorldMatrix()
            meshes[0].doNotSyncBoundingInfo = true;
            meshes[0].cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD;
        });

        // City import
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "buildify_city_build_modelSmall_1.0.glb", scene, function (meshes) {
            meshes[0].position.y = 0;
            meshes[0].position.z = 0;
            meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            meshes[0]._freeze();
            meshes[0].disableEdgesRendering();
            meshes[0].freezeWorldMatrix()
            meshes[0].doNotSyncBoundingInfo = true;
            meshes[0].cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD;
            document.getElementById("loading-text").innerText = "Pret !";
            document.getElementById("playButton").disabled = false;
        });

        /* TREES */

        // Yellow tree import

        let duplicate = function(container, offset) {
            let entries = container.instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
            for (let node of entries.rootNodes) {
                node.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
                node.position.z += -240 + offset;
            }
        }

        BABYLON.SceneLoader.LoadAssetContainer("src/models/", "reduce_tree.glb", scene, function (container) {
            container.addAllToScene();
            for (let i = 0; i < 7; i++) {
                duplicate(container, 30 * i);
            }
        })


        // BOSS CAR SMOKE
        
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "free_car_001.gltf", scene, function (meshes) {
            let pos = new BABYLON.Vector3(10, 0, 130)
            let angle = Math.PI;
            let carModel
            carModel = meshes[0];
            carModel.position = pos;
            carModel.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            carModel._freeze();
            carModel.disableEdgesRendering();
            carModel.freezeWorldMatrix()
            carModel.doNotSyncBoundingInfo = true;
            console.log("Car model loaded !")

            scene.registerBeforeRender(function () {
                angle += 0.05;
                carModel.rotation = new BABYLON.Vector3(0, angle, 0);
            });
        });

        // Smoke under car
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.createSmokeParticle(130 + i - 2.5, 0,  5 + j - 2.5, 2);
            }
        }
         

        let sidewalk = BABYLON.MeshBuilder.CreateBox("block", {width: 22, height: 1, depth: 550}, scene);
        sidewalk.position.y = -0.5;
        sidewalk.position.z = -100;
        sidewalk.position.x = -6;
        sidewalk.checkCollisions = true;
        sidewalk.collisionRetryCount = 1;

        let sidewalkLeft = BABYLON.MeshBuilder.CreateBox("block", {width: 50, height: 1, depth: 20}, scene);
        sidewalkLeft.position.y = -0.5;
        sidewalkLeft.position.z = -260;
        sidewalkLeft.checkCollisions = true;
        sidewalkLeft.collisionRetryCount = 1;

        let sidewalkRight = BABYLON.MeshBuilder.CreateBox("block", {width: 50, height: 1, depth: 10}, scene);
        sidewalkRight.position.y = -0.5;
        sidewalkRight.position.z = -40;
        sidewalkRight.checkCollisions = true;
        sidewalkRight.collisionRetryCount = 1;

        let sidewalkRightLeft = BABYLON.MeshBuilder.CreateBox("block", {width: 50, height: 1, depth: 10}, scene);
        sidewalkRightLeft.position.y = -0.5;
        sidewalkRightLeft.position.z = 5;
        sidewalkRightLeft.checkCollisions = true;
        sidewalkRightLeft.collisionRetryCount = 1;

        let road = BABYLON.MeshBuilder.CreateBox("block", {width: 50, height: 0.5, depth: 550}, scene);
        road.position.y = -0.5;
        road.position.z = -100;
        road.material = new BABYLON.StandardMaterial("roadMaterial", scene);
        road.material.diffuseColor = new BABYLON.Color3.FromHexString("#2F3337");
        road.checkCollisions = true;
        road.collisionRetryCount = 1;

        this.city =
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                                                                                                                          " + "                                                            " + "                                                                                                                          \n" +
            "                                                                                                     NC                                                                                                   " + "                                                            " + "                                                                                                                          \n" +
            "                                                              N                                      AA                                                                                                   " + "                                                            " + "                                                                      ←AA                                                 \n" +
            "                                            N          E                                      AA     AA             R                                                         C           R               " + "                                                            " + "                                                      N               ←AA                                                 \n" +
            "                                           AAAAA      AAA                              AA     AA     AA                               AA           NE               N      ←AAA                           " + "                                                            " + "                                        AA            AA                                                                  \n" +
            "                            N    AA   AA   AaaaA      AaA                              AA     AA     AA                         AAA   AA          AAAAA     AA     AA       AaA                           " + "                                                            " + "                                       EAA           ←AA          R                                                       \n" +
            "                       C    AA   AA   AA   AaaaA      AaA             AAAA       AA    AA     AA     AA                 ←AAA    AaA   AA          AaaaA     AA     AA       AaA                           " + "                                                            " + "                                      AAAA           ←AA                C        E     EN                                 \n" +
            "                      AA    AA   AA   AA   AaaaA      AaA             AaaA       AA    AA     AA     AA                   AA    AaA   AA          AaaaA     AA     AA       AaA                           " + "                                                            " + "                                AA    AAAA           ←AA              ←AA       AA     AA           Y                     \n" +
            "  S   N  ↑     AA  ↑  AA↑↑↑↑AA↑↑↑AA↑↑↑AA↑↑↑AaaaA↑↑↑↑↑↑AaA↑↑↑↑↑↑↑↑↑↑↑↑↑AaaA↑↑↑↑↑↑↑AA↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑AA↑↑↑↑AaA↑↑↑AA↑↑↑↑↑↑↑↑↑↑AaaaA↑↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑↑↑AaA↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑   N M   " + "                                                            " + "CN     ↑↑↑↑    ↑    ↑↑↑↑   AA   AA↑↑↑↑AAAA↑↑↑↑↑↑↑↑↑↑↑↑AA↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑AA↑↑↑↑↑↑↑AA↑↑↑↑↑AA  C    E  EEE  CN EXE            \n";


        /* UNDERGROUND */

        // 21 center 21 = 43
        this.map =


            // TODO : LEVEL 4

            "AAAAAAAAAAAA         AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAA       AaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA    N    AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA        AAAaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA          AAAAaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAẂ  E l      AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAA    AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAaaaaaaaaaaaaaaA    AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA       AAaaaaaaaaaaaaA    AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   aaaA        AaaaaaaaaaaAAA    AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa        AAA  ↑↑  E AaaaaaaaaaaA      AaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaa↓↓↓↓↓↓↓↓aaaaaaaaaaA         AAA  AA   ←A        AA    AAAAaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaAA  ↓↓↓↓↓↓↓↓        ↓↓↓↓↓↓↓↓↓aA         AAA  AA   ←A        ←A   AAaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaA→                           AA   ↑↑      A   A              A   AaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaA→         ←A                AA   AA      A   A                  AaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaA    ↑     A   ↑     E      AA   AAE         A                C AaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaAAAA    A         A→                 A         CA        AAAA  AAAAAaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaA       AE        A→          C      A        AAA               ←AaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaA   CN                     AAAAAAAAAAA↑↑↑↑↑↑↑↑↑↑        ↑↑↑↑↑↑↑aaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaAAAAAA↑↑↑↑↑       ↑↑↑↑↑↑    AaaaaaaaaaAAAAAAAAAA↑↑↑↑↑↑↑↑aaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaAAAAA↑↑↑↑↑↑↑AAAAAA↑↑↑↑aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaẂA\n" +

            ///////////// TOaO : LEEEEEEEEEEEEVEL 3

            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaa                                                                aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaa                                                                aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaa                                                                    aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaa                                                                    aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaA                                                 R                  aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaA                                                                    aaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaAAA                                        C      ↑↑                   aaaaaAAAaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                             ↑           AAAA    AA   ↑↑                      AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                             A   AAA     AaaA    AA   AA                      AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                             A   ↑       AaaA    AA   AA    ↑↑                AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                                EA       AaaA    AA   AA    AA                AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                            N    A       AaaA↑↑↑↑AA   AA    AA                AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaAA     N      R           AAA            AaaaAAAAAA↑↑↑AA    AA                AaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaAA  C                   AAaa            AaaaaaaaaaAAAAA↑↑↑↑AA               ẂAaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaAAAA↑↑↑↑↑↑↑↑↑↑↑↑↑↑AAAAAAa↑↑↑↑↑↑↑↑↑↑↑↑AaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +

            ///////////// TOaO : LEEEEEEEEEEEEVEL 2

            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  aa   aaaa   aaaaaaaaaaaaaaaaaaAAaaa    aaaAAAaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa→   a      ↓     AAAaaaaaaaaaAAAA               AAaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa→   ↓             AAAaaaaaaaaA                    Aaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA       R         ↓↓AaaaaaaaaA                     Aaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaa   aaaaaaaA                  AaaaaaaaaaA       N    E      ẂAaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaa a       aaaA    ↑↑↑↑↑↑        ←AaaaaaaaaA   AAAAAAAAAAAAAAAAAAaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaa aaaa   aaaaaa  ↓         aA   AAAAAAA        ←AaaaaaaaaA   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaa   aa     aa               aA   AaaaaaA    E   ←Aaa    aaA   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA     a     ↓                 A   AaaaaaA         A        A   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA     ↓                         EAAaaaaaA                      Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA              R               NAAaaaaaaa↑        C            Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA                             Aaaaaaaaaaaa       AAA           Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA  CN   AA            AA↑↑   ←Aaaaaaaaaaaa                     Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaAAAAA  AA            AAAA↑↑      ←aaaaaaa↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑aaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaa↑↑AA↑↑↑↑↑↑↑↑↑↑↑↑aaaaaa      ←aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa↑↑↑↑↑↑aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +

            ///////////// TOaO : LEEEEEEEEEEEEVEL 1
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaa      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaa           aaaaaaaaaaaaaaaaa↓   aaaaaaaaa        aaaaaaaaa   aaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaa                ←aaaaaaaaaaa      Aaaaaa           aaaaaaa     aaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaA                ←aaaaaaaAA↓↓        AaA              Aaaaa        aaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaA               AAaaaa  aAAA          AaA                Aaa         aaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaA               Aaaaa↓  ↓AAA   ↑↑↑↑↑  AaA                AA            aaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaA CN            AAAAA     AA   AAAAA  AaA                 ↓          ←AaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaAAA↑↑    AA     ↓↓↓       A   AaAAA  AaA    C N                     ←AaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaa↑↑↑↑AA    E              AaAA   AAA   AAAA           R       ←AAAaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaa          ↑     N  AaAA   AAA   AaaA↑↑ L              ←AAAAaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaa↑↑↑↑↑↑↑AAAAAAAAAAAAAaAA    AA   AaaAAA↑↑↑↑↑                aaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA          AaaaaaAAAAA  L             aaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA    E   N Aaaaaaaaaaa↑↑↑↑↑          ẂaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAAAaaaaaaaaaaaaaaaa↑↑↑↑ LAAAAAaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa↑↑↑↑↑aaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +


            ///////////// TOaO : TUUUUUUUUUUUUTORIAL
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa     aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaAAAAAAA  AAA    AAAAA    AAAAAAA          aaaaaaaaaa   aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaAA   AA           AA      AAAA             AAAAAAAA         AAAAAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaAA    A            A      ↓↓↓↓             ↓  AA↓             AAAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaA     A            ↓                          AA              AAAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AAAA   AAAA    ↓     ↓                                       A                AAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AA        A                                                  ↓                 Aaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         A         ↓                         E                                        AAAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         ↓                              N                                              AAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA                                        A          A                                   AAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA                                       AA    L     AA                                   Aaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA          NC          ↑      ↑     ↑  AAA↑↑↑↑↑↑↑↑↑↑AAA      ↑↑      N        ↑↑       ẂAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n";


        /**
         A Block A
         B Block B
         S Spawn point
         P Plane A
         E Energy
         R Reload dash
         ' ' Void
         ↓ Spike down
         ↑ Spike up
         → Spike right
         ← Spike left
         Ẃ Exit door right _ |_
         Ẁ Exit door left  _| _
         L Light
         K smoKe
         */
    }

    createSkyBox() {
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 1000.0}, this.scene);
        skybox.freezeWorldMatrix();
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.freeze()
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;

        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("src/skyboxs/" + this.preset.skybox_texture, this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        return skybox;
    }

    // zOffset and yOffset sets the top left corner coordinates
    generate(zOffset, yOffset, xOffset, level) {
        let str;
        switch (level) {
            case "map" :
                str = this.map;
                break;
            case "city" :
                str = this.city;
                break;
            default :
                console.log("Unable to generate level because level specified in parameter of function generate dont match any case")
                return;
        }

        let layer = str.split("\n");
        let spawn;
        let blockAThin = this.initOriginalThinBlock(this.preset.material_block_A);
        let blockA = this.initOriginalBlock(this.preset.material_block_A);
        let planeA = this.initOriginalPlane(this.preset.material_plane_A);
        let spikeA = this.initOriginalSpikeA(this.preset.material_spike_A);
        let spikeB = this.initOriginalSpikeB(this.preset.material_spike_A);

        for (let l = layer.length - 2; l >= 0; l--) {
            for (let i = 0; i < layer[l].length; i++) {
                switch (layer[l].charAt(i)) {
                    case " ": // Void
                        break;
                    case "S": // Spawn point for player
                        spawn = new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset);
                        break;
                    case "Ẃ": // Exit door right
                        this.createExitDoor(i + zOffset, -l + yOffset, xOffset, "right");
                        break;
                    case "Ẁ": // Exit door left
                        this.createExitDoor(i + zOffset, -l + yOffset, xOffset, "left");
                        break;
                    case "P": // Plane A
                        this.createPlaneInstance(i + zOffset, -l + yOffset, xOffset, planeA, this.meshIndex);
                        break;
                    case "↑": // Spike up
                        this.createSpikeInstance(i + zOffset, -l + yOffset, xOffset, "up", spikeA, spikeB, this.meshIndex);
                        break;
                    case "↓": // Spike down
                        this.createSpikeInstance(i + zOffset, -l + yOffset, xOffset, "down", spikeA, spikeB, this.meshIndex);
                        break;
                    case "→": // Spike right
                        this.createSpikeInstance(i + zOffset, -l + yOffset, xOffset, "right", spikeA, spikeB, this.meshIndex);
                        break;
                    case "←": // Spike left
                        this.createSpikeInstance(i + zOffset, -l + yOffset, xOffset, "left", spikeA, spikeB, this.meshIndex);
                        break;
                    case "A": // Block A instance for internal block with interactions and collisions
                        this.createBlockInstance(i + zOffset, -l + yOffset, xOffset, blockA, this.meshIndex);
                        break;
                    case "a": // Block A Thin Instance for external blocks with no interactions
                        this.createBlockThinInstance(i + zOffset, -l + yOffset, xOffset, blockAThin);
                        break;
                    case "R": // Reload dash
                        new Collectible(this.scene, "collectible_reload_dash", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(0, 100, 0));
                        break;
                    case "E": // Energy
                        new Collectible(this.scene, "collectible_energy", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(100, 100, 0));
                        this.numberTrash++;
                        break;
                    case "L": // light
                        this.createLight(i + zOffset, -l + yOffset, xOffset);
                        break;
                    case "K":
                        this.createSmokeParticle(i + zOffset, -l + yOffset, xOffset);
                        break;
                    case "C":
                        this.createCheckpoint(i + zOffset, -l + yOffset, xOffset);
                        break;
                    case "M":
                        new Collectible(this.scene, "manhole_cover", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(100, 100, 0));
                        break;
                    case "N":
                        new Collectible(this.scene, "nextDiag", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(100, 100, 0));
                        break;
                    case "X":
                        new Collectible(this.scene, "fight", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(100, 100, 0));
                        break;
                    case "Y":
                        new Collectible(this.scene, "start_drift", new BABYLON.Vector3(xOffset, -l + yOffset, i + zOffset), new BABYLON.Color3(100, 100, 0));
                        break;
                }
                this.meshIndex++;
            }
        }

        this.trashBar = new TrashBar(this.numberTrash);

        return spawn;
    }


    initOriginalBlock(presetMaterial) {
        let block = BABYLON.MeshBuilder.CreateBox("block", {size: 1}, this.scene);
        block.rotation.x = Math.PI / 2;
        block.checkCollisions = true;
        block.collisionRetryCount = 1;
        block.freezeWorldMatrix();
        const blockMaterial = new BABYLON.StandardMaterial("blockMaterial", this.scene);
        blockMaterial.freeze()
        blockMaterial.diffuseTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        blockMaterial.emissiveTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        blockMaterial.maxSimultaneousLights = 100;
        block.material = blockMaterial;

        return block;
    }

    initOriginalThinBlock(presetMaterial) {
        let block = BABYLON.MeshBuilder.CreateBox("block", {size: 1}, this.scene);
        const blockMaterial = new BABYLON.StandardMaterial("blockMaterial", this.scene);
        blockMaterial.freeze()
        blockMaterial.diffuseTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        blockMaterial.emissiveTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        blockMaterial.maxSimultaneousLights = 100;
        block.material = blockMaterial;

        return block;
    }

    initOriginalPlane(presetMaterial) {
        let plane = BABYLON.MeshBuilder.CreatePlane("plane", {size: 1}, this.scene);
        plane.freezeWorldMatrix();
        plane.checkCollisions = true;
        plane.rotation.y = -Math.PI / 2;

        const planeWallMaterial = new BABYLON.StandardMaterial("planeWallMaterial", this.scene);
        planeWallMaterial.freeze()
        const texture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        planeWallMaterial.diffuseTexture = texture;
        planeWallMaterial.maxSimultaneousLights = 100;
        plane.material = planeWallMaterial;

        return plane;
    }

    initOriginalSpikeA(presetMaterial) {
        const spikeA = BABYLON.MeshBuilder.CreateCylinder("spike", {
            diameterTop: 0,
            height: 0.5,
            tessellation: 4,
            diameterBottom: 0.5
        });

        spikeA.freezeWorldMatrix();
        spikeA.checkCollisions = true;
        spikeA.collisionRetryCount = 1;
        spikeA.setBoundingInfo(new BABYLON.BoundingInfo(new BABYLON.Vector3(-0.25, -0.25, -0.25), new BABYLON.Vector3(0.25, 0.30, 0.25)));
        spikeA.showBoundingBox = true;

        const spikeMaterial = new BABYLON.StandardMaterial("spikeMaterial", this.scene);
        spikeMaterial.freeze();
        spikeMaterial.diffuseTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        spikeMaterial.emissiveTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        spikeMaterial.maxSimultaneousLights = 0;
        spikeA.material = spikeMaterial;

        return spikeA;
    }

    initOriginalSpikeB(presetMaterial) {
        const spikeB = BABYLON.MeshBuilder.CreateCylinder("spike", {
            diameterTop: 0,
            height: 0.5,
            tessellation: 4,
            diameterBottom: 0.5
        });

        spikeB.freezeWorldMatrix();
        spikeB.checkCollisions = true;
        spikeB.collisionRetryCount = 1;
        spikeB.setBoundingInfo(new BABYLON.BoundingInfo(new BABYLON.Vector3(-0.25, -0.25, -0.25), new BABYLON.Vector3(0.25, 0.30, 0.25)));
        spikeB.showBoundingBox = true;

        const spikeMaterial = new BABYLON.StandardMaterial("spikeMaterial", this.scene);
        spikeMaterial.freeze();
        spikeMaterial.diffuseTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        spikeMaterial.emissiveTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
        spikeMaterial.maxSimultaneousLights = 0;
        spikeB.material = spikeMaterial;

        return spikeB;
    }

    createLight(posZ, posY) {
        let light = new BABYLON.PointLight("MapLight", new BABYLON.Vector3(10, posY, posZ), this.scene);
        light.intensity = 5;
        light.radius = 10;
        light.range = 10;
        light.setEnabled(true);

        let lightSphere = BABYLON.MeshBuilder.CreateSphere("lightSphere", {segments: 16, diameter: 0.5}, this.scene);
        lightSphere.material = new BABYLON.StandardMaterial("lightSphereMaterial", this.scene);
        lightSphere.material.diffuseColor = BABYLON.Color3.FromHexString(this.preset.light_color);
        lightSphere.material.specularColor = BABYLON.Color3.FromHexString(this.preset.light_color);
        lightSphere.material.emissiveColor = BABYLON.Color3.FromHexString(this.preset.light_color);
        lightSphere.scaling = new BABYLON.Vector3(0.0001, 0.0001, 0.0001);

        light.diffuse = BABYLON.Color3.FromHexString(this.preset.light_color);
        light.specular = BABYLON.Color3.FromHexString(this.preset.light_color);

        lightSphere.position = light.position;
    }

    createExitDoor(posZ, posY, posX, LR) {
        let door = BABYLON.MeshBuilder.CreateBox("exitDoor", {size: 1, height: 2, width: 1, depth: 0.2}, this.scene);
        door.freezeWorldMatrix();
        if (LR === "right") {
            door.position = new BABYLON.Vector3(posX, posY + 0.5, posZ + 0.4);
        } else {
            door.position = new BABYLON.Vector3(posX, posY + 0.5, posZ - 0.4);
        }
        door.checkCollisions = true;
        door.showBoundingBox = true;
        console.log(this.destinationIndex);
        console.log( this.doorDestinations[this.destinationIndex]);
        door.metadata = this.doorDestinations[this.destinationIndex];

        const doorMaterial = new BABYLON.StandardMaterial("doorMaterial", this.scene);
        doorMaterial.freeze()
        const texture = new BABYLON.Texture("src/materials/iron_door.png", this.scene);
        doorMaterial.diffuseTexture = texture;
        doorMaterial.maxSimultaneousLights = 100;
        door.material = doorMaterial;

        this.destinationIndex++;
    }

    createCheckpoint(posZ, posY, posX) {
        let item = BABYLON.MeshBuilder.CreateBox("checkpoint", {size: 0.5}, this.scene);
        item.position = new BABYLON.Vector3(posX, posY - 0.5, posZ);
        item.showBoundingBox = true;
        item.checkCollisions = false;
        item.visibility = 0;
        let data = {
            pos: new BABYLON.Vector3(posX, posY, posZ),
            taken: false
        }
        item.metadata = data
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "checkpoint.glb", this.scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(posX, posY - 0.5, posZ);
            meshes[0].checkCollisions = true;
            meshes[0].showBoundingBox = true;
            meshes[0].scaling = new BABYLON.Vector3(5, 5, 5);
            meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); //alpha x, beta y, gamma z in radians
        });
    }

    createSpikeInstance(posZ, posY, posX, direction, originalMeshA, originalMeshB, index) {
        let spikeA = originalMeshA.createInstance('spike');
        let spikeB = originalMeshB.createInstance('spike');
        spikeA.checkCollisions = true;
        spikeB.checkCollisions = true;
        switch (direction) {
            case "up":
                spikeA.position = new BABYLON.Vector3(posX, posY - 0.25, posZ + 0.25);
                spikeB.position = new BABYLON.Vector3(posX, posY - 0.25, posZ - 0.25);
                break;
            case "down":
                spikeA.position = new BABYLON.Vector3(posX, posY + 0.25, posZ + 0.25);
                spikeA.rotation.x = Math.PI;
                spikeB.position = new BABYLON.Vector3(posX, posY + 0.25, posZ - 0.25);
                spikeB.rotation.x = Math.PI;
                break;
            case "right":
                spikeA.position = new BABYLON.Vector3(posX, posY + 0.25, posZ - 0.25);
                spikeA.rotation.x = Math.PI / 2;
                spikeB.position = new BABYLON.Vector3(posX, posY - 0.25, posZ - 0.25);
                spikeB.rotation.x = Math.PI / 2;
                break;
            case "left":
                spikeA.position = new BABYLON.Vector3(posX, posY + 0.25, posZ + 0.25);
                spikeA.rotation.x = -Math.PI / 2;
                spikeB.position = new BABYLON.Vector3(posX, posY - 0.25, posZ + 0.25);
                spikeB.rotation.x = -Math.PI / 2;
                break;
        }
    }

    createPlaneInstance(posZ, posY, posX, originalMesh, index) {
        let plane = originalMesh.createInstance('i' + index);
        plane.position = new BABYLON.Vector3(posX - 0.5, posY, posZ);
        plane.checkCollisions = true;
        plane.rotation.y = -Math.PI / 2;
    }

    createBlockThinInstance(posZ, posY, posX, originalMesh) {
        let matrix = BABYLON.Matrix.Translation(posX, posY, posZ);
        originalMesh.thinInstanceAdd(matrix)
    }

    createBlockInstance(posZ, posY, posX, originalMesh, index) {
        let block = originalMesh.createInstance('i' + index);
        block.position = new BABYLON.Vector3(posX, posY, posZ);
        block.rotation.x = Math.PI / 2;
        block.checkCollisions = true;
        block.collisionRetryCount = 1;
    }

    createSmokeParticle(posZ, posY) {
        //BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(0, posY, posZ)).start();
        let particleSystem = new BABYLON.ParticleSystem("smoke", 2000, this.scene);
        // set the particle texture
        let texture = new BABYLON.Texture("src/materials/cloud2.png", this.scene);

        particleSystem.particleTexture = texture;
        // set the emitter
        particleSystem.emitter = new BABYLON.Vector3(10, posY, posZ);

        // set the particle system properties
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1);
        //particleSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.1);
        //particleSystem.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
        //particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        particleSystem.emitRate = 100;
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;
        particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-1, 0, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 0, 1);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1.5;
        particleSystem.updateSpeed = 0.005;

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

        // start the particle system
        particleSystem.start();
    }

    createLadder(posY, posZ, scene) {
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "ladder.glb", this.scene, function (meshes) {
            // make the object bigger
            meshes[0].scaling = new BABYLON.Vector3(3, 4, 3);
            meshes[0].position.x = 10;
            meshes[0].position.y = posY;
            meshes[0].position.z = posZ;
            // rotate the mesh

        });
    }

}  