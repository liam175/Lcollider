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
        this.lock = [false,false]
    }
    //to get the force of the object
    lockpos(x,y){
        this.lock[0]=x
        this.lock[1]=y
    }
    get getForce() {
        return this.force;
    }
    setGrav(g,mv){
        this.grav=g;
        this.maxVel=mv;
    }
    setCollActivation(thing,pos){
        this.activate[pos] = thing;
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
        if(!this.lock[0]){
            this.pos[0] += this.force[0];
        }
        if(!this.lock[1]){
            this.pos[1] += this.force[1];
        }
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
                                    if(check[i][c].getForce!=null&&!check[i][c].colliding[p]&&!check[i][c].lock[1]){
                                        check[i][c].pos[1]-=.1
                                    }else if(check[i][c].getForce!=null){
                                        this.pos[1]+=.1
                                        if (this.force[0] > 0) {
                                            this.force[0] = 0;
                                        }
                                    }else if(!this.lock[1]){
                                    this.pos[1] += .3;
                                    if (this.force[1] < 0) {
                                        this.force[1] = 0;
                                    }
                                }
                                } else if (p == 1) {//right
                                    if(check[i][c].getForce!=null&&!check[i][c].colliding[p]&&!check[i][c].lock[0]){
                                        check[i][c].pos[0]+=.1
                                    }else if(check[i][c].getForce!=null){
                                        this.pos[0]-=.1
                                        if (this.force[0] > 0) {
                                            this.force[0] = 0;
                                        }
                                    }else if(!this.lock[0]){
                                        this.pos[0] -= .1;
                                    if (this.force[0] > 0) {
                                        this.force[0] = 0;
                                    }
                                }
                                } else if (p == 2) {//bottom
                                    if(check[i][c].getForce!=null&&!check[i][c].colliding[p]&&!check[i][c].lock[1]){
                                        check[i][c].pos[1]+=.1
                                    }else if(check[i][c].getForce!=null){
                                        this.pos[1]-=.1
                                        if (this.force[0] > 0) {
                                            this.force[0] = 0;
                                        }
                                    }else if(!this.lock[1]){
                                    floor = true;
                                    this.pos[1] -= .3;
                                    if (this.force[1] > 0) {
                                        this.force[1] = 0;
                                    }
                                }
                                } else if (p == 3) {//left
                                    if(check[i][c].getForce!=null&&!check[i][c].colliding[p]&&!check[i][c].lock[0]){
                                        check[i][c].pos[0]-=.1
                                    }else if(check[i][c].getForce!=null){
                                        this.pos[0]+=.1
                                        if (this.force[0] > 0) {
                                            this.force[0] = 0;
                                        }
                                    }else if(!this.lock[0]){
                                    this.pos[0] += .1;
                                    if (this.force[0] < 0) {
                                        this.force[0] = 0;
                                    }
                                }
                                }
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0], this.point[p][p1][1] - .1 + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==0){
                                this.colliding[0] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0] + .1, this.point[p][p1][1] + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==1){
                                this.colliding[1] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0], this.point[p][p1][1] + this.pos[1] + .2, check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==2){
                                this.colliding[2] = true
                            }
                            if(rectCheck(this.point[p][p1][0] + this.pos[0] - .1, this.point[p][p1][1] + this.pos[1], check[i][c].pos[0], check[i][c].pos[1], check[i][c].width, check[i][c].height)&&p==3){
                                this.colliding[3] = true
                            }
                        }
                        
                    }
                }
            }
        }
        //activates colliding functions 
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
let constObj = [new constant([0, 375], 400, 100), new constant([375, 0], 25, 400), new constant([0, 0], 25, 400)]
let items = [new item([100, 300], [[[25, 0]], [[50, 5]], [[25, 10]], [[0, 5]]], 50, 10),new item([200, 100], [[[5, 0]], [[10, 5]], [[5, 20]], [[0, 5]]], 10, 20)]
items[1].setCollActivation(() =>{items[1].setForce(Math.random()*4-2,-5)},2)
items[1].setCollActivation(() =>{items[1].setForce(-2,-3)},1)
items[1].setCollActivation(() =>{items[1].setForce(2,-3)},3)
items[1].setGrav(.1,3);
items[0].lockpos(false,true)

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
        items[a].tick([constObj,items]);
        context.fillRect(items[a].pos[0], items[a].pos[1], items[a].width, items[a].height);
    }
    context.fillStyle = 'blue';
    for (let b = 0; b < constObj.length; b++) {
        context.fillRect(constObj[b].pos[0], constObj[b].pos[1], constObj[b].width, constObj[b].height);
    }
    window.requestAnimationFrame(gameloop);
}
