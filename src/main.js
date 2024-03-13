import kaboom from "kaboom"

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;

// initialize context
kaboom();
kaboom({
	background: [ 139, 154, 115],
});

// load assets
//loadSound("cartoon-jump", "sounds/cartoon-jump.mp3");
loadFont("catboo", "fonts/Catboo.ttf");
loadSprite("hugo", "sprites/hugo.png", {
	sliceX: 2,
	sliceY: 1,
	anims: {
		run: {from: 0, to: 1, speed: 5, loop: true},
		leap: {from: 1, to: 1, speed: 5, loop: false},
	}
}); 


scene("game", () => {
	let SPEED = 480;

    setGravity(1600);

    const player = add([
        // list of components
        sprite("hugo"),
        pos(150, 40),
        area({scale: 0.6}),
		anchor("bot"),
        body(),
    ]);

	player.play("run");

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    function jump() {
    	if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", () => {
		jump();
		player.play("leap");
		//play("cartoon-jump");
	});
    onMousePress(() => {
		jump();
		player.play("leap");
		//play("cartoon-jump");
	});
	
    // continue run animation after jump is released
	onKeyRelease("space", () => {
		player.play("run");
	});
	onMouseRelease(() => {
		player.play("run");
	});

    function spawnTree() {

        // add tree obj
        add([
            rect(48, rand(70, 120)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(219, 154, 72),
            move(LEFT, SPEED),
            "tree",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(1, 3), spawnTree);

    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score, {
			font: "catboo",}),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
		
		if (score % 500 == 0) {
			shake(10); 
			SPEED = SPEED+100;	
		}
    });

});

scene("lose", (score) => {

    add([
        sprite("hugo"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text("<Hu-Go!>\n"+score, {
			font: "catboo",
			align: "center",
			size: 50,}),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("game");