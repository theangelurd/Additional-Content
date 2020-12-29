const emra = new Planet("emra", Planets.sun, 3.6, 3);
emra.generator = new SerpuloPlanetGenerator();
emra.mesh = new HexMesh(emra, 6);
emra.bloom = false;
emra.radius = 1;
emra.accessible = true;
emra.hasAtmosphere = true;
emra.atmosphereColor = Color.valueOf("1c195c");
emra.atmosphereRadIn = 0.02;
emra.atmosphereRadOut = 0.2;
emra.localizedName = "Emra";

const navalValley = new SectorPreset("navalValley", emra, 18);
navalValley.captureWave = 25;
navalValley.localizedName = "Naval Valley";
navalValley.difficulty = 4;
navalValley.alwaysUnlocked = true;
