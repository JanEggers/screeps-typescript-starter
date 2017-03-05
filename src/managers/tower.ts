export class TowerManager {
    static run(room: Room) {
        room.toString();
        return;
        /*
        var towers = room.find<Tower>(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
        });

        towers.forEach((tower) => {
            var closestDamagedStructure = tower.pos.findClosestByRange<Structure>(FIND_STRUCTURES, {
                filter: (structure:Structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        });
        */
    }
}
