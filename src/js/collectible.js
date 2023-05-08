export default class Collectible {
    constructor(scene, type, vector, color) {
        this.scene = scene;
        this.type = type;
        this.vector = vector;
        this.color = color;
        this.item = this.createItem(type, scene);
    }

    createItem(type, scene) {
        let item = BABYLON.MeshBuilder.CreateBox(this.type, {size: 0.5}, this.scene);
        item.position = this.vector;
        item.checkCollisions = false;

        let itemMaterial = new BABYLON.StandardMaterial("itemMaterial", this.scene);
        itemMaterial.diffuseColor = this.color;
        item.material = itemMaterial;
        item.visibility = 0;

        BABYLON.SceneLoader.ImportMesh("", "src/models/",  type + ".glb", scene, function (meshes) {
            //scene.createDefaultLight(true);
            console.log(type);
            // make the object bigger
            //
            if (type === "collectible_energy") {     // taille et position differente en fonction de l'objet 3d
                meshes[0].scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
                meshes[0].position.y = 0;
                meshes[0].rotation = new BABYLON.Vector3(0, Math.random() * 100, 0); //alpha x, beta y, gamma z in radians
            } else if (type === "collectible_reload_dash"){
                meshes[0].position.y = 0;
                meshes[0].scaling = new BABYLON.Vector3(0.0035, 0.0035, 0.0035);
            } else if (type = "manhole_cover") {
                meshes[0].scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                meshes[0].position.y += -0.5;
                //10, 0, -50
            }
            // assign 3d object to the cube hitbox (item)
            meshes[0].parent = item;
        });


        BABYLON.SceneLoader.ImportMesh("", "src/models/",  "manhole_cover.glb", scene, function (meshes) {
            // make the object bigger

        });
    

        return item;
    }
}