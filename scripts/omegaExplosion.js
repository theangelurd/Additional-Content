const omegaexplosion = new Effect(60, e => {
    Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, e.fin());
    Lines.stroke(e.fout() * 6)
    Lines.circle(e.x, e.y, e.fin() * 38)
    Lines.stroke(e.fslope() * 1)
    Lines.circle(e.x, e.y, e.fslope() * 23)
    const d = new Floatc2({get(x, y){
    Lines.stroke(e.fout());
        Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x,y), e.fslope() * 10);
     }})
    Angles.randLenVectors(e.id, 30, e.fin() * 30, e.rotation, 360,d)
    Angles.randLenVectors(e.id, 10, e.fin() * 15, e.rotation, 360,d)
});