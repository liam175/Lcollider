let canv = document.querySelector("#canvas");
let context = canv.getContext('2d');
let width = canv.width;
let height = canv.height;
let grounded = false;
//----------------------------------------------
function rectCheck(x, y, x1, y1, w, h) {
    if (x >= x1 && x <= x1 + w) {
        if (y >= y1 && y <= y1 + h) {
            return true;
        }
    }
}
class constant {
    constructor(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
    }
}
class item {
    //make the things
    constructor(pos, point, width, height) {
        //gravity
        this.grav = 0;
        //position [x,y]
        this.pos = pos;
        //this exsplains itself
        this.force = [0,0];
        // point to check colision ex: [[top],[right],[bottom],[left]]
        this.point = point;
        //max velocity of gravity only
        this.maxVel = 1;
        this.width = width;
        this.height = height;
        this.colliding = [false,false,false,false]
        this.activate = [function blank(){},function blank(){},function blank(){},function blank(){}];
    }
    //to get the force of the object
    get getForce() {
        return this.force;
    }
    setGrav(g,mv){
        this.grav=g;
        this.maxVel=mv;
    }
    setCollActivation(top,right,bottom,left){
        this.activate = [top,right,bottom,left];
    }
    // add to the force
    addForce(x, y) {
        this.force[0] += x;
        this.force[1] += y;
    }
    // set the force
    setForce(x, y) {
        this.force[0] = x;
        this.force[1] = y;
    }
    // to do the gravity and stuff
    //check is the list of thing you are checking so you can have diferent coliders
    tick(check) {
        this.colliding=[false,false,false,false]
        let floor = false;
        this.pos[0] += this.force[0];
        this.pos[1] += this.force[1];
        //for colliders. c for constant object and p for points lists in item and p1 for individual points.
        for (let i = 0; i < check.length; i++) {
            for (let c = 0; c < check[i].length; c++) {
                if (this.pos != check[i][c].pos) {
                    for (let p = 0; p < this.point.length; p++) {
                        for (let p1 = 0; p1 < this.point[p].length; p1++) {
                            while (rectCheck(this.point[p][p1][0] + this.pos[0], this.point[p][p1][1] + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)) {
                                //if position
                                //  add oposite of position
                                //  stop force in that direction
                                if (p == 0) {//top
                                    this.pos[1] += .3;
                                    if (this.force[1] < 0) {
                                        this.force[1] = 0;
                                    }
                                } else if (p == 1) {//right
                                    this.pos[0] -= .1;
                                    if (this.force[0] > 0) {
                                        this.force[0] = 0;
                                    }
                                } else if (p == 2) {//bottom
                                    floor = true;
                                    this.pos[1] -= .3;
                                    if (this.force[1] > 0) {
                                        this.force[1] = 0;
                                    }
                                } else if (p == 3) {//left
                                    this.pos[0] += .1;
                                    if (this.force[0] < 0) {
                                        this.force[0] = 0;
                                    }
                                }
                            }
                            
                            if(rectCheck(this.point[p][p1][0] + this.pos[0], this.point[p][p1][1] - .5 + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==0){
                                this.colliding[0] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0] + 5, this.point[p][p1][1] + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==1){
                                this.colliding[1] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0], this.point[p][p1][1] + this.pos[1] + .5, check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==2){
                                this.colliding[2] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0] - .5, this.point[p][p1][1] + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==3){
                                this.colliding[3] = true
                            }
                        }
                    }
                }
            }
        }
        if(this.colliding[0]){
            this.activate[0]()
        }
        if(this.colliding[1]){
            this.activate[1]()
        }
        if(this.colliding[2]){
            this.activate[2]()
        }
        if(this.colliding[3]){
            this.activate[3]()
        }
        if (this.force[1] < this.maxVel && !floor) {
            this.force[1] += this.grav;
        }
    }
}

//constObj, rectCheck and items are needed
let constObj = [new constant([0, 300], 400, 100), new constant([350, 0], 50, 400), new constant([100, 200], 50, 10), new constant([330, 250], 20, 10), new constant([330, 150], 20, 10), new constant([330, 50], 20, 10),new constant([100, 250], 10, 50)]
let items = [new item([100, 100], [[[5, 0]], [[10, 5]], [[5, 20]], [[0, 5]]], 10, 20)]
items[0].setGrav(.1,3);
//----------------------------------------------
let keys = [false, false]
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 39) {
        keys[1] = true;
    }
    if (event.keyCode == 37) {
        keys[0] = true;
    }
    if (event.keyCode == 38) {
        items[0].addForce(0, -5)
    }
});
document.addEventListener('keyup', function (event) {
    if (event.keyCode == 39) {
        keys[1] = false;
    } else if (event.keyCode == 37) {
        keys[0] = false;
    }
});
function move() {
    if (keys[0]) {
        items[0].setForce(-2, items[0].getForce[1])
    }
    if (keys[1]) {
        items[0].setForce(2, items[0].getForce[1])
    }
    if (!keys[1] && !keys[0]) {
        items[0].setForce(0, items[0].getForce[1])
    }
}
gameloop()
function gameloop() {
    move();
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'red';
    for (let a = 0; a < items.length; a++) {
        items[a].tick([constObj]);
        context.fillRect(items[a].pos[0], items[a].pos[1], items[a].width, items[a].height);
    }
    context.fillStyle = 'blue';
    for (let b = 0; b < constObj.length; b++) {
        context.fillRect(constObj[b].pos[0], constObj[b].pos[1], constObj[b].width, constObj[b].height);
    }
    window.requestAnimationFrame(gameloop);
}
