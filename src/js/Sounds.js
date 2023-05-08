export default class Sounds {
    constructor (scene) {
        this.anotherMedium = new BABYLON.Sound("another_medium", "src/musics/another_medium.mp3", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0.1,
          });
    
        this.wetFart = new BABYLON.Sound("wet_fart", "src/musics/wet_fart.mp3", scene, null, {
            volume: 5,
            offset: 0.5
        });
    
        this.pickup_dash_boost = new BABYLON.Sound("pickup_dash_boost", "src/musics/pickup_dash_boost.mp3", scene, null, {
            volume: 1,
            offset: 0.2
        });
    
        this.pickup_trash = new BABYLON.Sound("pickup_trash", "src/musics/pickup_trash.mp3", scene, null, {
            volume: 1,
            offset: 0.3
         });

        this.take_damage = new BABYLON.Sound("take_damage", "src/musics/take_damage.mp3", scene, null, {
            volume: 1,
            offset: 0.3
         });
        this.open_close_door = new BABYLON.Sound("open_close_door", "src/musics/open_close_door.mp3", scene, null, {
            volume: 1,
            offset: 0.3
         });
        this.lose_game = new BABYLON.Sound("lose_game", "src/musics/lose.mp3", scene, null, {
            volume: 1,
            offset: 0.3
         });
        this.checkpoint = new BABYLON.Sound("checkpoint", "src/musics/checkpoint.mp3", scene, null, {
            volume: 1,
            offset: 0.3
         });
    } 
}