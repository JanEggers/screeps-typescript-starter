import {
    getFreeTerrainAround
} from './../tools';

 import {
    IRole
 } from './role';

export function findEnergySource(creep:Creep) {
    //delete creep.memory.sourceid;
    var sourceid = creep.memory.sourceid;
    if (!sourceid) {
        var sources = creep.room.find<Source>(FIND_SOURCES);

        var sourceWithUsage = sources.map((s) => {
            var count = 0;
            for(var name in Game.creeps) {
                let creep = Game.creeps[name];
                if (creep.memory.sourceid == s.id) {
                    count++;
                }
            }

            return {
                source: s,
                count: getFreeTerrainAround(creep.room, s.pos) - count,
            };
        });

        var sortedSource = sourceWithUsage.sort((a, b) => {
            return b.count - a.count;
        });

        var source = sortedSource.map((s) => {
            return s.source;
        })[0];

        creep.memory.sourceid = source.id;
    }
    return creep.memory.sourceid;
}

export function harvest(creep:Creep) {
	    var needsEnergy = !creep.carry.energy || creep.carry.energy < creep.carryCapacity;
	    if(needsEnergy) {
            var source = Game.getObjectById<Source>(findEnergySource(creep));
            if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }

        return needsEnergy;
	}

function willDeliverToStuctureType(structure: Structure) {
    switch(structure.structureType) {
        case STRUCTURE_SPAWN:
        case STRUCTURE_EXTENSION:
        case STRUCTURE_TOWER:
        case STRUCTURE_CONTAINER:
            return true;
        default:
            return false;
    }
}

export class Harvester implements IRole {
    static roleName = 'Harvester';

    roleName = Harvester.roleName;
    body = [WORK,CARRY,MOVE];
    grow = [WORK,CARRY,MOVE];
    max = 1;

    run(creep: Creep) {
        if(!harvest(creep)) {
            var targets = creep.room.find<Structure>(FIND_STRUCTURES, {
                    filter: (structure: Structure) => {
                        var result = true;
                        if ( structure instanceof StructureSpawn ) {
                            var spawn = <StructureSpawn>structure;
                            result = result && spawn.energy < spawn.energyCapacity;
                        }
                        else if ( structure instanceof StructureStorage ) {
                            var store = <StructureStorage>structure;
                            result = result && <number><any>store.store < store.storeCapacity;
                        }

                        return result && willDeliverToStuctureType(structure);
                    }
            });

            if(targets.length == 0) {
                targets = creep.room.find<Structure>(FIND_STRUCTURES, {
                    filter: (structure: Structure) => {
                        return willDeliverToStuctureType(structure);
                    }
                });
            }

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
	}
}
