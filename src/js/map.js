import Collectible from "./collectible.js";
import TrashBar from './trashBar.js';

export default class Map {

    constructor(scene, preset, y) {
        this.scene = scene;
        this.trashBar = null;
        this.preset = preset;
        this.meshIndex = 0;
        //this.skybox = this.createSkyBox();
        this.numberTrash = 0;

        this.doorDestinations = {
            // The index is the order of generation of the doors (begins by the bottom-left and end tpo-right)
            // So index 0 correspond of the first generated door (bottom-left) and the index n correspond of the last generated door (top-right of the map)
            0: new BABYLON.Vector3(10, 22 + y, -40),   //x, y, z
            1: new BABYLON.Vector3(10, 34 + y, -37),
            2: new BABYLON.Vector3(10, 10 + y + 34, -36),
            3: new BABYLON.Vector3(10, 26 + y + 35, -35),
            4: new BABYLON.Vector3(10, 50 + y + 38, -37),
        };
        this.destinationIndex = 0;

        /* CITY */
        // City import


        BABYLON.SceneLoader.ImportMesh("", "src/models/", "buildify_city_build_modelSmall_1.0.glb", scene, function (meshes) {
            console.log("City loaded !")
            meshes[0].position.y = 0;
            meshes[0].position.z = 0;
            meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            meshes[0]._freeze();
            meshes[0].disableEdgesRendering();
            meshes[0].freezeWorldMatrix()
            meshes[0].doNotSyncBoundingInfo = true;
            meshes[0].cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD;
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
        /*
        BABYLON.SceneLoader.ImportMesh("", "src/models/", "free_car_001.gltf", scene, function (meshes) {
            let pos = new BABYLON.Vector3(20, 0, -245)
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
                this.createSmokeParticle(-245 + i - 2.5, 0,  20 + j - 2.5, 2);
            }
        }
         */

        let sidewalk = BABYLON.MeshBuilder.CreateBox("block", {width: 22, height: 1, depth: 240}, scene);
        sidewalk.position.y = -0.5;
        sidewalk.position.z = -150;
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

        let road = BABYLON.MeshBuilder.CreateBox("block", {width: 50, height: 0.5, depth: 240}, scene);
        road.position.y = -0.5;
        road.position.z = -150;
        road.material = new BABYLON.StandardMaterial("roadMaterial", scene);
        road.material.diffuseColor = new BABYLON.Color3.FromHexString("#2F3337");
        road.checkCollisions = true;
        road.collisionRetryCount = 1;

        this.city =
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                                                                                                                        \n" +
            "                                                                                                      C                                                                                                 \n" +
            "                                                                                                     AA                                                                                                bo \n" +
            "                                            C          E                                E     AA     AA             R                 E                                       C           R             \n" +
            "                                 E         AAAAA      AAA                              AA     AA     AA                          C    AA             C      E              ←AAA                         \n" +
            "                                 AA   AA   AaaaA      AaA              EC              AA     AA     AA                         AAA   AA          AAAAA     AA     AA       AaA                         \n" +
            "                       C    AA   AA   AA   AaaaA      AaA             AAAA       AA    AA     AA     AA                 ←AAA    AaA   AA          AaaaA     AA     AA       AaA                         \n" +
            "                      AA    AA   AA   AA   AaaaA      AaA             AaaA       AA    AA     AA     AA                   AA    AaA   AA          AaaaA     AA     AA       AaA                         \n" +
            "     S   ↑   E AA  ↑  AA↑↑↑↑AA↑↑↑AA↑↑↑AA↑↑↑AaaaA↑↑↑↑↑↑AaA↑↑↑↑↑↑↑↑↑↑↑↑↑AaaA↑↑↑↑↑↑↑AA↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑AA↑↑↑↑AaA↑↑↑AA↑↑↑↑↑↑↑↑↑↑AaaaA↑↑↑↑↑AA↑↑↑↑↑AA↑↑↑↑↑↑↑AaA↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑     M \n";


        /* UNDERGROUND */

        // 21 center 21 = 43
        this.map =


            // TODO : LEVEL 4

            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +

            ///////////// TOaO : LEEEEEEEEEEEEVEL 3

            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA\n" +

            ///////////// TOaO : LEEEEEEEEEEEEVEL 2

            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  aa   aaaa   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa→   a      ↓     AAAaaaaaaaaaAAAAAAAAAAaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa→   ↓             AAAaaaaaaaaA        Aaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA       R         ↓↓AaaaaaaaaA        Aaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaaaa   aaaaaaaA                  AaaaaaaaaaA        Aaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaaaaaaaaa a       aaaA    ↑↑↑↑↑↑        ←AaaaaaaaaA   AAAAAAaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaa aaaa   aaaaaa  ↓         aA   AAAAAAA        ←AaaaaaaaaA   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         Aaaaaaaaa   aa     aa               aA   Aaaaaaa    E   ←Aaa    aaA   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA     a     ↓                 A   Aaaaaaa         A        A   Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA     ↓                          AAaaaaaa                      Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA              E                AAaaaaaaa↑        C            Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA                             Aaaaaaaaaaaa       AAA           Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaA  C    AA            AA↑↑   ←Aaaaaaaaaaaa                     Aaaaaaaaaaaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA         AaaaaaaaAAAAA  AA            AAAA↑↑   L  ←aaaaaaa↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑aaaaaaaaaaaaaaaaaaaa\n" +
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
            "aaaaaaaaaaaA         AaaaaaA C             AAAAA     AA   AAAAA  AaA                 ↓          ←AaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaAAA↑↑    AA    ↓↓↓↓       A   AaAAA  AaA    C                       ←AaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaa↑↑↑↑AA    E              AaAA   AAA   AAAA           R       ←AAAaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaa          ↑        AaAA   AAA   AaaA↑↑ L              ←AAAAaaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         Aaaaaaaaaaaaaaaaaa↑↑↑↑↑↑↑AAAAAAAAAAAAAaAA    AA   AaaAAA↑↑↑↑↑                aaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA          AaaaaaAAAAA  L             aaaaaaaaaaaaaA\n" +
            "aaaaaaaaaaaA         AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA    E     Aaaaaaaaaaa↑↑↑↑↑          ẂaaaaaaaaaaaaaA\n" +
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
            "aaaaaaaaaaaA         ↓                                                                             AAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA                                        A          A                                   AAaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA                                       AA    L     AA                                   Aaaaaaaaaaaa\n" +
            "aaaaaaaaaaaA       E   C          ↑      ↑     ↑  AAA↑↑↑↑↑↑↑↑↑↑AAA           E                     ẂAaaaaaaaaaaa\n" +
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
         l ladder
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
                        this.createExitDoor(i + zOffset, -l + yOffset, xOffset, new BABYLON.Vector3.Zero(), "left");
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
                }
                console.log(this.meshIndex);
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
        blockMaterial.maxSimultaneousLights = 100;
        block.material = blockMaterial;

        return block;
    }

    initOriginalThinBlock(presetMaterial) {
        let block = BABYLON.MeshBuilder.CreateBox("block", {size: 1}, this.scene);
        const blockMaterial = new BABYLON.StandardMaterial("blockMaterial", this.scene);
        blockMaterial.freeze()
        blockMaterial.diffuseTexture = new BABYLON.Texture("src/materials/" + presetMaterial, this.scene);
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

    createExitDoor(posZ, posY, posX, destination, LR) {
        let door = BABYLON.MeshBuilder.CreateBox("exitDoor", {size: 1, height: 2, width: 1, depth: 0.2}, this.scene);
        door.freezeWorldMatrix();
        if (LR === "right") {
            door.position = new BABYLON.Vector3(posX, posY + 0.5, posZ + 0.4);
        } else {
            door.position = new BABYLON.Vector3(posX, posY + 0.5, posZ - 0.4);
        }
        door.checkCollisions = true;
        door.showBoundingBox = true;
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
        let texture = new BABYLON.Texture("src/materials/cloud.png", this.scene);

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

    /* createParticuleAmbiant(posZ, posY, gravity) {
        let particleSystem = new BABYLON.ParticleSystem("particles", 200, this.scene);
        let fountain = BABYLON.Mesh.CreateBox("foutain", 0.01, this.scene);
        fountain.position = new BABYLON.Vector3(10, posY, posZ);
        particleSystem.particleTexture = new BABYLON.Texture("src/materials/flare.png", this.scene);
        particleSystem.emitter = fountain;
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 1
        particleSystem.emitRate = 2;
        particleSystem.gravity = new BABYLON.Vector3(0, gravity, 0);
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 5;
        particleSystem.updateSpeed = 0.004;
        let noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, this.scene);
        noiseTexture.animationSpeedFactor = 5;
        noiseTexture.persistence = 4;
        noiseTexture.brightness = 0.5;
        noiseTexture.octaves = 2;
        particleSystem.noiseTexture = noiseTexture;
        particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
        particleSystem.start();
    }
        */
}  