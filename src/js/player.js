export default class Player {
    constructor(position, dashVelocity, jumpVelocity, movementSpeed, scene, engine) {
        this.scene = scene;
        this.engine = engine;
        this.body = this.createPlayer(position);
        // Energy
        this.maxEnergy = 40;
        this.bar = this.initEnergyBar();

        // jump
        this.isJumping = false;
        this.jumpVelocity = jumpVelocity;
        // dash
        this.dashVelocity = dashVelocity;
        this.canDash = true;
        this.isDashing = false;
        // move
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.lastDirection = "";
        this.movementSpeed = movementSpeed;
        // direction
        this.isLookingRight = false;
        this.isLookingLeft = false;

        this.forward = null;
    }

    createPlayer(spawn){
        let cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1, height: 1.2}, this.scene);
        cube.position = spawn;
        cube.ellipsoid = new BABYLON.Vector3(0.5,0.60,0.5);
        cube.checkCollisions = true;
        cube.visibility = 0.1;
        cube.collisionRetryCount = 1;
        cube.showBoundingBox = true;

        let cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial",  this.scene);
        cubeMaterial.diffuseColor = new BABYLON.Color3(100, 100, 100);
        cube.material = cubeMaterial;

        return cube;
    }

    doRotation(direction){
        const startFrame = 0;
        const endFrame = 4;
        const frameRate = 20;
        let isAbleToRotate = false;
        if (direction === "left"){
            isAbleToRotate = !this.isLookingLeft;
        }
        else if (direction === "right"){
            isAbleToRotate = !this.isLookingRight;
        }

        if (isAbleToRotate){
            const yRotate = new BABYLON.Animation("yRotate", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const keyFrames = [];

            keyFrames.push({
                frame: startFrame,
                value: this.body.rotation.y
            });

            if (direction === "left"){
                keyFrames.push({
                    frame: endFrame,
                    value: this.body.rotation.y + Math.PI
                });
            }
            else if (direction === "right"){
                keyFrames.push({
                    frame: endFrame,
                    value: this.body.rotation.y - Math.PI
                });
            }

            yRotate.setKeys(keyFrames);
            this.body.animations.push(yRotate);

            //forward animation
            this.scene.beginAnimation(this.body, startFrame, endFrame, false);
        }

        if (direction === "left"){
            this.isLookingLeft = true;
        }
        else if (direction === "right"){
            this.isLookingRight = true;
        }
    }

    initEnergyBar(){
        const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let energyBarContainer = new BABYLON.GUI.Rectangle();
        let maxWidth = this.maxEnergy;
        energyBarContainer.widthInPixels = maxWidth;
        energyBarContainer.heightInPixels = 5;
        energyBarContainer.color = "black";
        energyBarContainer.thickness = 1;
        energyBarContainer.background = "grey";
        gui.addControl(energyBarContainer);
        energyBarContainer.linkWithMesh(this.body);
        energyBarContainer.linkOffsetY = -50;

        let energyBar = new BABYLON.GUI.Rectangle();
        energyBar.widthInPixels = maxWidth;
        energyBar.heightInPixels = 5;
        energyBar.cornerRadius = 1;
        energyBar.color = "black";
        energyBar.thickness = 1;
        energyBar.background = "yellow";
        gui.addControl(energyBar);
        energyBar.linkWithMesh(this.body);
        energyBar.linkOffsetY = -50;

        setInterval(function () {
            if (energyBar.widthInPixels > 0){
                energyBar.widthInPixels--;
                energyBar.linkOffsetX = -(maxWidth - energyBar.widthInPixels)/2;
            }
        }, 300);

        return energyBar;
    }

    fillEnergy(){
        if (this.bar.widthInPixels < this.maxEnergy - 10){
            this.bar.widthInPixels = 40;
        }else {
            this.bar.widthInPixels += this.maxEnergy - this.bar.widthInPixels;
        }
        this.bar.linkOffsetX = -(this.maxEnergy - this.bar.widthInPixels)/2;
    }

    hasNoEnergy() {
        return this.bar.widthInPixels === 0;
    }


}