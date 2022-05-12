const generators = require("urunirGen");
const urunir = extend(Planet, "urunir", Planets.sun, 2, 2, {
    generator: Version.number >= 7 ? Planets.serpulo.generator : Planets.serpulo.generator,
    meshLoader: () => new HexMesh(this, 7),
    bloom: true,
    radius: 3,
    accessible: true,
    hasAtmosphere: true,
    atmosphereColor: Color.valueOf("db8d6e"),
    atmosphereRadIn: 0.1,
    atmosphereRadOut: 0.15,
    localizedName: "Urunir"
});
urunir.meshLoader = () => extend(HexMesh, urunir, 7, {});

const landingPoint = extend(SectorPreset, "landing-point", urunir, 0, {
    description: "The initial starting point for the harsh planet Urunir.",
    localizedName: "Landing Point",
    difficulty: 3,
    alwaysUnlocked: true
});

module.exports = {
    urunir: urunir,
    landingPoint: landingPoint,
};
