const emra = new Planet("emra", Planets.sun, 3.6, 0.8);
emra.generator = new SerpuloPlanetGenerator();
emra.mesh = new HexMesh(emra, 5);
emra.bloom = false;
emra.radius = 1;
emra.accessible = true;
emra.hasAtmosphere = true;
emra.atmosphereColor = Color.valueOf("7d95d6");
emra.atmosphereRadIn = 0.01;
emra.atmosphereRadOut = 0.1;
emra.localizedName = "Emra";

const navalValley = new SectorPreset("navalValley", emra, 18);
navalValley.captureWave = 25;
navalValley.localizedName = "Naval Valley";
navalValley.difficulty = 4;
navalValley.alwaysUnlocked = true;
