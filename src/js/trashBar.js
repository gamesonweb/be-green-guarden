export default class TrashBar {

    constructor(totalTrash) {
        this.maxTrash = 300;
        this.oneTrash = this.maxTrash/totalTrash;
        this.bar = this.init();
    }

    init(){
        const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let trashBarContainer = new BABYLON.GUI.Rectangle();
        let maxHeight = 10;
        trashBarContainer.widthInPixels = this.maxTrash;
        trashBarContainer.heightInPixels = maxHeight;
        trashBarContainer.color = "black";  
        trashBarContainer.thickness = 1;
        trashBarContainer.background = "grey";
        trashBarContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        trashBarContainer.top = maxHeight;
        gui.addControl(trashBarContainer);

        let trashBar = new BABYLON.GUI.Rectangle();
        trashBar.widthInPixels = 0;
        trashBar.heightInPixels = maxHeight;
        trashBar.cornerRadius = 1;
        trashBar.color = "black";
        trashBar.thickness = 1;
        trashBar.background = "red";
        trashBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        trashBar.top = maxHeight;
        gui.addControl(trashBar);

        return trashBar;
    }

    fillTrash(){
        if (this.bar.widthInPixels < this.maxTrash - this.oneTrash){
            this.bar.widthInPixels += this.oneTrash;
        }else {
            this.bar.widthInPixels += this.maxTrash - this.bar.widthInPixels;
        }
        this.bar.left = -(this.maxTrash - this.bar.widthInPixels)/2;
    }

}