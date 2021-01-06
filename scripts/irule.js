const BlueGroundT2 = extendContent(UnitType, "protidae", {});
BlueGroundT2.constructor = () => extend(UnitWaterMove, {});
BlueGroundT2.abilities.add(new ForceFieldAbility(12, 0.13, 260, 80 * 5));
BlueGroundT2.abilities.add(new ShieldRegenFieldAbility(8, 120, 80, 10));
BlueGroundT2.ammoType = AmmoTypes.power;
