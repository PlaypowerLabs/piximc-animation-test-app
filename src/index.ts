import "pixi-spine";
import "./style.css";
import { Application, Assets, Sprite } from "pixi.js";

import { attachConsole } from "./utils/attach-console";
import piximc from 'pixi-mc';
import TSound from 'pixi-mc';

const gameWidth = 800;
const gameHeight = 600;

console.log(
    `%cPixiJS V7\nTypescript Boilerplate%c ${VERSION} %chttp://www.pixijs.com %c❤️`,
    "background: #ff66a1; color: #FFFFFF; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
    "color: #D81B60; font-weight: bold;",
    "color: #C2185B; font-weight: bold; text-decoration: underline;",
    "color: #ff66a1;",
);

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    const backgroundTexture = Assets.get("background");
    const background = new Sprite(backgroundTexture);

    // Resize to fit screen

    // Add to the bottom layer
    app.stage.addChildAt(background, 0);

   /*  const birdFromSprite = createBird();

    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(gameWidth / 2, gameHeight / 4);

    const spineExample = await getSpine();

    app.stage.addChild(birdFromSprite);
    app.stage.addChild(spineExample);
    app.stage.interactive = true; */

    let penguin: piximc.MC;
    let horseMovement: piximc.MC;
    piximc.MCLoader.autoLoadModel('/assets/penguin/').then(function (model) {

        //make instance
        penguin = new piximc.MC(model.mainSymbolModel);
        const catMC2 = model.makeInstance();//shortcut
    
        app.stage.addChild(penguin);
        //after added to stage, MC would auto showing frame1, and add Children at frame 1
    
        penguin.player.fps = 12;
        penguin.timeline.gotoAndPlay(0);
        penguin.x = 500;
        penguin.y = 100;

        penguin.visible = false;
        //auto add/remnove children in/not at that frame
    
        //make instance from MC's child
    });

    piximc.MCLoader.autoLoadModel('/assets/barn/FRM_Horse/horseSteps/').then(function (model) {

        //make instance
        horseMovement = new piximc.MC(model.mainSymbolModel);
    
        app.stage.addChild(horseMovement);
        app.stage.addChildAt(horseMovement, 2);
        //after added to stage, MC would auto showing frame1, and add Children at frame 1
    
        horseMovement.player.fps = 12;
        horseMovement.timeline.stop();
        horseMovement.x = 300;
        horseMovement.y = 400;
        horseMovement.visible = false;
        //auto add/remnove children in/not at that frame
    
        // //make instance from MC's child
        // horseMovement.eventMode = "static";
        // horseMovement.cursor = "pointer";
        // horseMovement.timeline.stop();
        // horseMovement.on("pointertap", () => {
        //     if (horseMovement.timeline.currentFrame == 1) {
        //         horseMovement.timeline.gotoAndPlay(0);
        //     }
        // });

        // // Stop animation at final frame
        // horseMovement.timeline.on("frameChange", () => {
        //     if (horseMovement.timeline.currentFrame >= 13) {
        //         horseMovement.timeline.gotoAndStop(1);
        //     }
        // });
    });

    piximc.MCLoader.autoLoadModel('/assets/barn/FRM_Horse/barnDoor/').then(function (model) {

        //make instance
        const horse = new piximc.MC(model.mainSymbolModel);
        const catMC2 = model.makeInstance();//shortcut
    
        app.stage.addChild(horse);
        app.stage.addChildAt(horse, 1);
        //after added to stage, MC would auto showing frame1, and add Children at frame 1
    
        horse.player.fps = 12;
        horse.timeline.stop();
        horse.x = 300;
        horse.y = 300;
        //auto add/remnove children in/not at that frame
    
        //make instance from MC's child
        horse.eventMode = "static";
        horse.cursor = "pointer";
        horse.timeline.stop();
        horse.on("pointertap", () => {
            if (horse.timeline.currentFrame == 1) {
                horse.timeline.gotoAndPlay(0);
            }
        });

        // Stop animation at final frame
        horse.timeline.on("frameChange", () => {
            if (horse.timeline.currentFrame >= 13) {
                horse.timeline.gotoAndStop(1);

                horseMovement.visible = true;
                horseMovement.timeline.gotoAndPlay(0);
                horseMovement.timeline.on("complete", () => {
                    if (horseMovement.timeline.currentFrame >= 10) {
                        horseMovement.visible = false;
                        penguin.visible = true;
                        penguin.timeline.gotoAndPlay(0);
                    }
                });
            }
        });
    });

    if (VERSION.includes("d")) {
        // if development version
        attachConsole(app.stage, gameWidth, gameHeight);
    }
};

async function loadGameAssets(): Promise<void> {
    const manifest = {
        bundles: [
            {
                name: "background",
                assets: [
                    {
                        name: "background",
                        srcs: "./assets/background/background.png",
                    },
                ],
            },
            {
                name: "bird",
                assets: [
                    {
                        name: "bird",
                        srcs: "./assets/simpleSpriteSheet.json",
                    },
                ],
            },
            {
                name: "pixie",
                assets: [
                    {
                        name: "pixie",
                        srcs: "./assets/spine-assets/pixie.json",
                    },
                ],
            },
            {
                name: "sound",
                assets: [
                    {
                        name: "doorSound",
                        srcs: "./assets/spine-assets/pixie.json",
                    },
                ],
            },
        ],
    };

    await Assets.init({ manifest });
    await Assets.loadBundle(["background","bird", "pixie"]);

}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}
