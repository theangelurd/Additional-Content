const emra = new Planet("emra", Planets.sun, 1.2, 0.9);
emra.generator = new SerpuloPlanetGenerator();
emra.mesh = new HexMesh(emra, 6);
emra.bloom = true;
emra.radius = 2;
emra.accessible = true;
emra.hasAtmosphere = true;
emra.atmosphereColor = Color.valueOf("000000ff");
emra.atmosphereRadIn = 0.02;
emra.atmosphereRadOut = 0.3;
emra.localizedName = "Emra";

const navalValley = new SectorPreset("navalValley", emra, 18);
navalValley.captureWave = 25;
navalValley.localizedName = "Naval Valley";
navalValley.difficulty = 4;

const planetEntryPoint = new SectorPreset("planetEntryPoint", emra, 27);
navalValley.captureWave = 15;
navalValley.localizedName = "Planet Entry Point";
navalValley.difficulty = 2;
alwaysUnlocked = true;
