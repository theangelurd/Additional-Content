const impra = extend(UnitType, impra, {
health: 80,
armor: 0,
speed: 0.85,
});
const impra.constructor = () => extend(MechUnit, {});
refresh(impra);
draw(){
this.super$draw();
drawLight(){Drawf.light(this.team, this.x, this.y, this.type.lightRadius + Math.sin(Time.time)/2 * 3, Color.valueOf("#ff5a00"), this.type.lightOpacity);},
},
classid: () => impra.classId
