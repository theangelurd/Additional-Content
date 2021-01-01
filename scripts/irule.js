const irule = extendContent(mech, "irule", {});
irule.constructor = function(){
  return extend(PayloadUnit, {});
};
irule.abilities.add(new ForceFieldAbility(12, 8/60, 260, 80 * 5), new ShieldRegenFieldAbility(8, 120, 80, 10));