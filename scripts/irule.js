const irule = extendContent(mech, "irule", {});
irule.constructor = function(){
  return extend(PayloadUnit, {});
};
irule.abilities.add(new ForceFieldAbility(16, 8/60, 280, 80 * 5, new ShieldRegenFieldAbility(3, 100, 80, 11));
