require("irel");
require("irule");
function content(unith){
  return Vars.content.getByName(ContentType.unit, unith);
}

fromArray = [content("patred"), content("tora"), content("irel"), content("suro")]
toArray = [content("tayros"), content("tremo"), content("irule"), content("ikuro")]

var upgrade1 = new Seq([fromArray[0], toArray[0]);
var upgrade2 = new Seq([fromArray[1], toArray[1]);
var upgrade3 = new Seq([fromArray[2], toArray[2]);
var upgrade4 = new Seq([fromArray[3], toArray[3]);
var upgrade5 = new Seq([fromArray[4], toArray[4]);

Blocks.additiveReconstructor.upgrades.add(upgrade1.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade2.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade3.toArray(UnitType));         
Blocks.additiveReconstructor.upgrades.add(upgrade4.toArray(UnitType));
Blocks.additiveReconstructor.upgrades.add(upgrade5.toArray(UnitType));
//thank you Sh1penfire for code.
