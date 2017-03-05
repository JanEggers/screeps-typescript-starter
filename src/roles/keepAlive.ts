export function KeepAlive(creep: Creep) {
    if (creep.memory.isRenew && creep.ticksToLive > CREEP_LIFE_TIME - 100) {
        creep.memory.isRenew = false;
        creep.memory.state = "idle"
    }

    if (!creep.memory.isRenew && creep.ticksToLive < 200) {
        creep.memory.isRenew = true;
    }

    if (creep.memory.isRenew) {
        var targets = creep.room.find<Spawn>(FIND_STRUCTURES, {
                filter: (structure: Spawn) => {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else {
                targets[0].renewCreep(creep);

            }
        }
    }

    //console.log(creep.name, "is renewing:", creep.memory.isRenew);
    return creep.memory.isRenew;
}
