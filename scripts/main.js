require("irel");
require("irule");

//clunkey code hopefully begone
function content(unith){
  return Vars.content.getByName(ContentType.unit, unith);
}

fromAray = [content("patred"), content("tora"), content("irel"), content("suro")]
toAray = [content("tayros"), content("tremo"), content("irule"), content("ikuro")]

var upgrade1 = new Seq([fromAray[0], toAray[0]);
var upgrade2 = new Seq([fromAray[1], toAray[1]);
var upgrade3 = new Seq([fromAray[2], toAray[2]);
var upgrade4 = new Seq([fromAray[3], toAray[3]);
var upgrade5 = new Seq([fromAray[4], toAray[4]);

Blocks.additiveReconstructor.upgrades.add(upgrade1.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade2.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade3.toArray(UnitType));         
Blocks.additiveReconstructor.upgrades.add(upgrade4.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade5.toArray(UnitType));
