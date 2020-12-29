giantExplosion = new Effect(16, e -> {
        color(Pal.bulletYellow);

        e.scaled(6, i -> {
            stroke(3f * i.fout());
            Lines.circle(e.x, e.y, 7f + i.fin() * 24f);
        });

        color(Color.gray);

        randLenVectors(e.id, 8, 9f + 23f * e.finpow(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, e.fout() * 8f + 8f);
        });

        color(Pal.lighterOrange);
        stroke(e.fout());

        randLenVectors(e.id + 2, 8, 2f + 46f * e.finpow(), (x, y) -> {
            lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 2f + e.fout() * 6f);
        });
    }),