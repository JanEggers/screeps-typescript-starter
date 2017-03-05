import { harvest } from './harvester';


import {
    IRole
} from './role';

export class Repair implements IRole {
    static roleName = 'Repair';

    roleName = Repair.roleName;
    body = [MOVE,CARRY,WORK];
    grow = [MOVE,CARRY,WORK];
    max = 0;

    run(creep: Creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	    }
/*

var wall = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL);
                    }
                })[0];

        for(var name in wall) {
            console.log(name, wall[name]);
        } */


	    if(creep.memory.repairing) {
	        var targets = creep.room.find<Structure>(FIND_STRUCTURES, {
                    filter: (structure:Structure) => {
                        return (structure.hits < structure.hitsMax);
                    }
                });

            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
        else {
            harvest(creep);
        }
	}
}
