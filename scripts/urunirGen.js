const environment = require("blocks/environment");
const weathers = require("weathers");
const pWaves = require("uWaves");

//pixelcraft
const urunirGenerator = extend(PlanetGenerator, {
    noiseOct(x, y, octaves, falloff, scl){
        let v = this.sector.rect.project(x, y).scl(7);
        return this.noise.octaveNoise3D(octaves, falloff, 1 / scl, v.x, v.y, v.z);
    },
    scatterRadius(srad, x, y, sblock){
        for(let x1 = -srad; x1 <= srad; x1++){
            for(let y1 = -srad; y1 <= srad; y1++){
                if(Mathf.chance(0.1)){
                    Vars.world.tile(x1 + x, y1 + y).setFloorUnder(sblock);
                }
            }
        }
    },
    blendBlock(tiles, Block, dst, radius, ignore, ignoreSolid){
        tiles.each((x, y) => {
            print("-----");
            print(x);
            print(y);
            let tile = Vars.world.tile(x, y);
            print(tile);
            let block = tile.block();
            print(block);
            let floor = tile.floor();
            print(floor);
            if(floor != Block || (block != Blocks.air && ignoreSolid) || floor == ignore) return;
            print("proceeding")
            let rad = radius;
            let found = false;
            for(let x1 = -rad; x1 <= rad; x1++){
                print(x1);
                for(let y1 = -rad; y1 <= rad; y1++){
                    print(y1);
                    if(Mathf.within(x, y, rad)) continue;
                    let tilef = Vars.world.tile(x + x1, y + y1);
                    if(tilef == null) break;
                    print(tilef);
                    
                    if(tilef.block() == Block || tilef.floor() == Block || tilef.overlay() == Block){
                        found = true;
                        break;
                    }
                }
            }

            if(found){
                floor.setBlock(dst);
                print("block found");
            }
            print("-----");
        });
    },
    rawHeight(position){
        position = Tmp.v33.set(position).scl(this.scl);
        return (Mathf.pow(this.noise.octaveNoise3D(7, 0.5, 1 / 3, position.x, position.y, position.z), 2.3) + this.waterOffset) / (1 + this.waterOffset);
    },

    getHeight(position){
        let height = this.rawHeight(position);
        return Math.max(height, this.water);
    },

    getColor(position){
        let block = this.getBlock(position);
        //replace undefined blocks with dark sand color
        if(block == null) return Blocks.darksand.mapColor;
        Tmp.c1.set(block.mapColor).a = 1 - block.albedo;
        
        return Tmp.c1;
    },

    genTile(position, tile){
        tile.floor = this.getBlock(position);
        tile.block = tile.floor.asFloor().wall;

        if(this.rid.getValue(position.x, position.y, position.z, 22) > 0.32){
            tile.block = Blocks.air;
        };
    },
    getBlock(position){
        let arr = this.arr;
        let scl = this.scl;
        
        let height = this.rawHeight(position);
        Tmp.v31.set(position);
        
        position = Tmp.v33.set(position).scl(scl);
        let rad = this.scl;
        let temp = Mathf.clamp(Math.abs(position.y * 2) / rad);
        let tnoise = this.noise.octaveNoise3D(7, 0.56, 1 / 3, position.x, position.y + 999, position.z);
        
        temp = Mathf.lerp(temp, tnoise, 0.5);
        height *= 1.2;
        height = Mathf.clamp(height);

        let res = arr[Mathf.clamp(Math.floor(temp * arr.length), 0, arr[0].length - 1)][Mathf.clamp(Math.floor(height * arr[0].length), 0, arr[0].length - 1)];
        return res;
    },
    generate(tiles, sec){
        this.tiles = tiles;
        this.sector = sec;
        
        const rand = this.rand;
        rand.setSeed(sec.id);
        
        //tile, sector
        let gen = new TileGen();
        this.tiles.each((x, y) => {
            gen.reset();
            let position = this.sector.rect.project(x / tiles.width, y / tiles.height);

            this.genTile(position, gen);
            tiles.set(x, y, new Tile(x, y, gen.floor, gen.overlay, gen.block));
        });
        
        const Room = {
            x: 0, y: 0, radius: 0,
            connected: new ObjectSet(),

            connect(to){
                if(this.connected.contains(to)) return;

                this.connected.add(to);
                
                const gend = urunirGenerator;
                let nscl = rand.random(20, 60);
                let stroke = rand.random(4, 12);
                
                gend.brush(gend.pathfind(this.x, this.y, to.x, to.y, tile => (tile.solid() ? 5 : 0) + gend.noiseOct(tile.x, tile.y, 1, 1, 1 / nscl) * 60, Astar.manhattan), stroke);
            }
        };
        
        const setRoom = (x, y, radius) => {
            let room = Object.create(Room);
            
            room.x = x;
            room.y = y;
            room.radius = radius;
            //room.connected.add(this);
            
            return room;
        };
        
        this.cells(4);
        this.distort(6, 15);

        this.width = this.tiles.width;
        this.height = this.tiles.height;

        let constraint = 1.3;
        let radius = this.width / 2 / Mathf.sqrt3;
        let rooms = rand.random(6, 8);
        let roomseq = new Seq();

        for(let i = 0; i < rooms; i++){
            Tmp.v1.trns(rand.random(360), rand.random(radius / constraint));
            let rx = Math.floor(this.width / 2 + Tmp.v1.x);
            let ry = Math.floor(this.height / 2 + Tmp.v1.y);
            let maxrad = radius - Tmp.v1.len();
            let rrad = Math.floor(Math.min(rand.random(9, maxrad / 2), 15));
            
            roomseq.add(setRoom(rx, ry, rrad));
        };
        
        let spawn = null;
        let enemies = new Seq();
        let enemySpawns = rand.random(1, Math.max(Mathf.floor(this.sector.threat * 4), 1));
        
        let offset = rand.nextInt(360);
        let length = this.width / 2.55 - rand.random(13, 23);
        let angleStep = 5;
        let waterCheckRad = 5;
        
        for(let i = 0; i < 360; i += angleStep){
            let angle = offset + i;
            let cx = Math.floor(this.width / 2 + Angles.trnsx(angle, length));
            let cy = Math.floor(this.height / 2 + Angles.trnsy(angle, length));
            let waterTiles = 0;

            //check for water presence.
            for(let rx = -waterCheckRad; rx <= waterCheckRad; rx++){
                for(let ry = -waterCheckRad; ry <= waterCheckRad; ry++){
                    let tile = this.tiles.get(cx + rx, cy + ry);
                    
                    if(tile == null || tile.floor().liquidDrop != null){
                        waterTiles++;
                    };
                };
            };

            if(waterTiles <= 4 || (i + angleStep >= 360)){
                spawn = setRoom(cx, cy, rand.random(10, 18));
                roomseq.add(spawn);

                for(let j = 0; j < enemySpawns; j++){
                    let enemyOffset = rand.range(60);
                    
                    Tmp.v1.set(cx - this.width / 2, cy - this.height / 2).rotate(180 + enemyOffset).add(this.width / 2, this.height / 2);
                    let espawn = setRoom(Math.floor(Tmp.v1.x), Math.floor(Tmp.v1.y), rand.random(10, 16));
                    roomseq.add(espawn);
                    enemies.add(espawn);
                };

                break;
            };
        };
        
        roomseq.each(room => this.erase(room.x, room.y, room.radius));

        let connections = rand.random(Math.max(rooms - 1, 1), rooms + 3);
        for(let i = 0; i < connections; i++){
            roomseq.random(rand).connect(roomseq.random(rand));
        };

        roomseq.each(room => spawn.connect(room));

        this.cells(1);
        this.distort(7, 9);

        this.inverseFloodFill(this.tiles.getn(spawn.x, spawn.y));
        
        print("generated spawn room")
        
        let ores = Seq.with(environment.karailum);
        let poles = Math.abs(this.sector.tile.v.y);
        let nmag = 0.5;
        let scl = 1;
        let addscl = 1.3;

        if(this.noise.octaveNoise3D(2, 0.5, scl, this.sector.tile.v.x, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.25 * addscl){
            ores.add(environment.alasium);
        };

        if(this.noise.octaveNoise3D(2, 0.5, scl, this.sector.tile.v.x + 1, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.5 * addscl){
            ores.add(environment.karailum);
        };

        if(this.noise.octaveNoise3D(2, 0.5, scl, this.sector.tile.v.x + 2, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.7 * addscl){
            ores.add(environment.safajilite);
        };

        if(rand.chance(0.25)){
            ores.add(Blocks.oreScrap);
        };

        let frequencies = new FloatSeq();
        for(let i = 0; i < ores.size; i++){
            frequencies.add(rand.random(-0.1, 0.01) - i * 0.01 + poles * 0.04);
        };

        this.pass((x, y) => {
            if(!this.floor.asFloor().hasSurface()) return;

            let offsetX = x - 4, offsetY = y + 23;
            for(let i = ores.size - 1; i >= 0; i--){
                let entry = ores.get(i);
                let freq = frequencies.get(i);
                
                if(Math.abs(0.5 - this.noiseOct(offsetX, offsetY + i * 999, 2, 0.7, (40 + i * 2))) > 0.22 + i * 0.01 &&
                    Math.abs(0.5 - this.noiseOct(offsetX, offsetY - i * 999, 1, 1, (30 + i * 4))) > 0.37 + freq){
                    this.ore = entry;
                    break;
                };  
            };

            if(this.ore == Blocks.oreScrap && rand.chance(0.33)){
                this.floor = Blocks.metalFloorDamaged;
            };
        });
        
        print("generated ores");
        
        this.scatter(Blocks.stone, environment.safite, 0.04);
        this.trimDark();
        this.median(2);
        this.tech();
        //this.blendBlock(this.tiles, Blocks.sandWater, environment.stormsand, Mathf.round(Mathf.random(2) + 1), Blocks.sand, true);
            
        this.pass((x, y) => {
            //random boulder
            if(this.floor == Blocks.stone || this.floor == Blocks.basalt || this.floor == Blocks.darksand){
                if(Math.abs(0.5 - this.noiseOct(x - 90, y, 4, 0.8, 65)) > 0.02){
                }
                else if(Math.abs(0.35 - this.noiseOct(x - 90, y, 4, 0.8, 60)) > 0.02 && Mathf.chance(this.noiseOct(x - 90, y, 4, 0.8, 30))){
                    let crater1 = this.floor == Blocks.stone ? Blocks.craters : environment.safite;
                    let charr1 = this.floor == Blocks.stone ? Blocks.charr : environment.safite;
                    if(Mathf.chance(0.5)) this.floor = crater1;
                    else this.floor = charr1;
                }
            };

            if(this.floor != null && this.floor != Blocks.basalt && this.floor != Blocks.mud && this.floor.asFloor().hasSurface()){
                let noise = this.noiseOct(x + 782, y, 5, 0.75, 260);
                if(noise > 0.72){
                    this.floor = noise > 0.78 ? Blocks.stone : (this.floor == Blocks.sand ? Blocks.sandWater : environment.uasite);
                    this.ore = Blocks.air;
                }else if(noise > 0.67){
                    this.floor = (this.floor == Blocks.stone ? this.floor : environment.irodite);
                    this.ore = Blocks.air;
                };
            };
        });
        
        let difficulty = this.sector.threat;
        const ints = this.ints;
        
        ints.clear();
        ints.ensureCapacity(this.width * this.height / 4);

        Schematics.placeLaunchLoadout(spawn.x, spawn.y);
        
        let snoise = this.noiseOct(spawn.x + 782, spawn.y, 7, 0.75, 530);
        let srad = 8;
        let sblock = snoise > 0.72 ? Blocks.stone : environment.irodite
        this.scatterRadius(srad, spawn.x, spawn.y, sblock)

        for(let i = 0; i < rooms.length; i++){
            this.scatterRadius(srad, rooms[i].x, spawnrooms[i].y, sblock)
        }
        
        enemies.each(espawn => this.tiles.getn(espawn.x, espawn.y).setOverlay(Blocks.spawn));

        let state = Vars.state;

        if(this.sector.hasEnemyBase()){
            this.basegen.generate(tiles, enemies.map(r => this.tiles.getn(r.x, r.y)), this.tiles.get(spawn.x, spawn.y), state.rules.waveTeam, this.sector, difficulty);
            state.rules.attackMode = this.sector.info.attack = true;
        }else{
            state.rules.winWave = this.sector.info.winWave = 10 + 5 * Math.max(difficulty * 10, 1);
        };

        let waveTimeDec = 0.4;

        state.rules.waveSpacing = Mathf.lerp(60 * 65 * 2, 60 * 60 * 1, Math.floor(Math.max(difficulty - waveTimeDec, 0) / 0.8));
        state.rules.waves = this.sector.info.waves = true;
        state.rules.enemyCoreBuildRadius = 480;
        state.rules.enemyLights = false;
        let col1 = Color.valueOf("#667a73").lerp(Color.valueOf("#455e56"), Mathf.random(1));
        col1.a = difficulty/18 * this.noiseOct(spawn.x + 450, spawn.y, 5, 0.45, 220) + 0.25;
        state.rules.ambientLight = col1;
        
        state.rules.spawns = pWaves.waves.generate(difficulty, new Rand(), state.rules.attackMode);
        state.rules.weather.add(Weather.WeatherEntry(weathers.strongStorm));
        //chose which destructive weather to add
        if(snoise > 0.7 || difficulty > 7 && !state.rules.attackMode) state.rules.weather.add(Weather.WeatherEntry(weathers.charringDeluge));
        else state.rules.weather.add(Weather.WeatherEntry(weathers.seedStorm));
        let lengthh = 0
        state.rules.weather.forEach(w => {
            lengthh++;
        });
        let weath = state.rules.weather.get(Math.round(Math.random() * (lengthh - 1))).weather;
        if(weath != weathers.charringDeluge) Call.createWeather(weath, 0.1, 1000 * difficulty + Math.random(1000) + 2000, 17.5 - Mathf.random(35), 17.5 - Mathf.chance(35));
    },
    postGenerate(tiles){
        if(this.sector.hasEnemyBase()){
            this.basegen.postGenerate();
        };
    } 
});
templuraGenerator.arr = [   
    [Blocks.deepwater, Blocks.darksandWater, Blocks.sandWater, Blocks.sand, environment.stormsand, Blocks.sand, Blocks.sand, Blocks.basalt, environment.dryGrass, environment.dryGrass, Blocks.dirt, Blocks.dirt, Blocks.stone],
    [Blocks.deepwater, Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.metalFloorDamaged, Blocks.dacite, Blocks.dirt, Blocks.dirt, Blocks.mud, Blocks.dirt, Blocks.mud],
    [Blocks.deepwater, Blocks.sandWater, Blocks.sand, Blocks.sand, environment.stormsand, environment.stormsand, Blocks.dirt, Blocks.basalt, Blocks.basalt, Blocks.basalt, Blocks.mud, Blocks.dirt, Blocks.mud],
    [Blocks.water, Blocks.sandWater, Blocks.salt, Blocks.salt, Blocks.sand, environment.stormsand, Blocks.stone, environment.stormsand, Blocks.stone, Blocks.mud, Blocks.dirt, Blocks.mud, Blocks.mud],
    [Blocks.salt, environment.stormsand, Blocks.sand, Blocks.salt, Blocks.stone, Blocks.water, Blocks.dirt, Blocks.basalt, Blocks.basalt, Blocks.mud, Blocks.dirt, Blocks.mud, Blocks.mud],
    
    [Blocks.darksandWater, Blocks.stone, Blocks.darksand, Blocks.slag, Blocks.mud, Blocks.mud, Blocks.dirt, Blocks.dirt, Blocks.dirt, Blocks.dirt, Blocks.mud, Blocks.mud, Blocks.mud],
    [Blocks.taintedWater, Blocks.darksandTaintedWater, Blocks.darksand, Blocks.slag, Blocks.slag, Blocks.mud, Blocks.mud, Blocks.dirt, Blocks.dirt, Blocks.mud, Blocks.mud, Blocks.mud, Blocks.mud],
    [Blocks.darksandTaintedWater, Blocks.darksandTaintedWater, Blocks.darksand, Blocks.slag, Blocks.basalt, Blocks.slag, Blocks.dacite, Blocks.dirt, Blocks.mud, Blocks.mud, Blocks.mud, Blocks.mud, Blocks.mud],
    [Blocks.darksandWater, Blocks.darksand, Blocks.dirt, Blocks.mud, Blocks.dacite, Blocks.dirt, Blocks.dirt, Blocks.dirt, Blocks.mud, Blocks.mud, Blocks.mud, Blocks.mud, Blocks.mud],

    [Blocks.darksandWater, Blocks.darksandWater, Blocks.darksand, Blocks.basalt, Blocks.basalt, Blocks.darksand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.darksandTaintedWater, Blocks.stone, Blocks.stone],
    [Blocks.darksandWater, Blocks.darksandWater, Blocks.darksand, Blocks.darksand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.darksandTaintedWater, Blocks.stone, Blocks.stone, Blocks.stone],
    [Blocks.sandWater, Blocks.darksandWater, Blocks.darksand, environment.dryGrass, environment.stormsand, environment.stormsand, Blocks.stone, Blocks.sand, Blocks.sand, Blocks.darksandTaintedWater, Blocks.stone, Blocks.stone, Blocks.stone],
    [Blocks.water, Blocks.sandWater, environment.stormsand, environment.dryGrass, environment.stormsand, environment.dryGrass, Blocks.sand, Blocks.stone, Blocks.stone, Blocks.stone, Blocks.dirt, Blocks.dacite, Blocks.mud]
];
urunirGenerator.rid = new Packages.arc.util.noise.RidgedPerlin(1, 2);
urunirGenerator.basegen = new BaseGenerator();
urunirGenerator.scl = 9;
urunirGenerator.waterOffset = 0.1;
urunirGenerator.water = 4 / urunirGenerator.arr[0].length;

module.exports = {
    urunir: urunirGenerator
};
