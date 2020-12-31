const smallExplosion = new Effect(24, () => {});
Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, e.fin());
Lines.stroke(e.fout() * 7)
Lines.circle(e.x, e.y, e.fin() * 13)
Lines.stroke(e.fslope() * 1)
Lines.circle(e.x, e.y, e.fslope() * 7)
const d = new Floatc2({get(x, y){
Lines.stroke(e.fout());
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x,y), e.fslope() * 5);
 }})
Angles.randLenVectors(e.id, 30, e.fin() * 30, e.rotation, 360,d)
Angles.randLenVectors(e.id, 10, e.fin() * 15, e.rotation, 360,d)

const impra = extendContent(mech,"impra",{});
impra.weapons.get(0).bullet.hitEffect = smallExplosion;
impra.weapons.get(0).bullet.despawnEffect = smallExplosion;
