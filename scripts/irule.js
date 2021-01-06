const irule = extendContent(mech, "irule", {});
  return extend(MechUnit, {});
};
irule.abilities.add(new ForceFieldAbility(12, 0.13, 260, 80 * 5), new ShieldRegenFieldAbility(8, 120, 80, 10));
