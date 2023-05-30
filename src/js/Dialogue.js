export default class Dialogue {
    constructor (scene) {
        this.tuto = []; 
        this.initDialogues();
    }


    initDialogues () {
        this.tuto[0] = "Un pic en pleine ville ?! Cela pourrait m'être fatal, je dois l'esquiver.\n" +
        "Je me sens lourd... Oh, mais ne serait-ce pas des réacteurs à mos dos... ? Peut être que je pourais m'en servir...";
    }

    init() {
        const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let dialogContainer = new BABYLON.GUI.Rectangle();
        dialogContainer.widthInPixels = 200;
        dialogContainer.heightInPixels = maxHeight;
        dialogContainer.color ="black";
        dialogContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        gui.addControl(dialogContainer);
    }





    
}