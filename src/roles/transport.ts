import {
    StateManager,
    approching,
    stateNames,
    CreepState,
    ICreepStateLookup
 } from './../states';

import {
    IRole
} from './role';

export namespace Transport {

    function willDeliverToStuctureType(structure: Structure) {
        switch(structure.structureType) {
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
            case STRUCTURE_CONTAINER:
                return true;
            default:
                return false;
        }
    }

    function findEnergyTarget(creep: Creep) {
        var targets: Structure[] | Creep[] = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
                filter: (structure: Spawn) => {
                    return willDeliverToStuctureType(structure) && (structure.energy < structure.energyCapacity);
                }
        });

        if(targets.length == 0) {
            targets = creep.room.find<Creep>(FIND_MY_CREEPS, {
                filter: (creep: Creep) => {
                    return creep.memory.needsEnergy && !creep.memory.isRenew;
                }
            });

            targets = targets.sort((a, b) => {
                var ae = a.carry.energy || 0;
                var be = b.carry.energy || 0;

                return ae - be;
            });
        }

        if(targets.length == 0) {
            targets = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE && !creep.memory.isRenew;
                }
            });
        }

        if(targets.length) {
            return targets[0];
        }
    }

    function findEnergy(creep: Creep) {
        var targets = creep.room.find<Resource>(FIND_DROPPED_RESOURCES);
        if(targets.length) {
            var sortedTargets = targets.sort((a, b) => {
                return b.amount - a.amount;
            });

            return sortedTargets[0];
        }
    }

    export class Idle extends CreepState {

        constructor() {
            super(stateNames.idle);

        }

        checkTransition(creep:Creep){
            if(creep.carry.energy == 0) {
                creep.memory.pickup = true;
            }

            if (creep.memory.pickup) {
                let target = findEnergy(creep);
                if (target) {
                    StateManager.setTarget(creep, target);
                    return stateNames.approching;
                }
            } else {
                let target = findEnergyTarget(creep);
                if (target) {
                    StateManager.setTarget(creep, target);
                    return stateNames.approching;
                }
            }

            return stateNames.idle;
        }

        run(creep: Creep) {
            creep.memory.needsEnergy = false;
        }
    }

    export class Working extends CreepState {
        constructor() {
            super(stateNames.working);

        }

        checkTransition(creep: Creep){
            var target = Game.getObjectById<Spawn>(creep.memory.targetId);
            if(creep.memory.pickup) {
                if (creep.carry.energy == creep.carryCapacity || !target) {
                    delete creep.memory.pickup;
                    return stateNames.idle;
                }
            } else {
                if (target && target.energy == target.energyCapacity || creep.carry.energy == 0) {
                    return stateNames.idle;
                }
            }

            return stateNames.working;
        }

        run(creep: Creep) {
            var target = Game.getObjectById(creep.memory.targetId);

            if (creep.memory.pickup) {
                creep.pickup(<Resource>target);
            } else {
                creep.transfer(<Structure>target, RESOURCE_ENERGY)
            }
        }
    }

    var states: ICreepStateLookup = {
        idle: new Idle(),
        approching: approching,
        working: new Working(),
    }

    export class Transport implements IRole {
        static roleName = 'Transport';

        roleName = Transport.roleName;
        body = [CARRY,MOVE];
        grow = [CARRY,MOVE];
        max = 4;

        run(creep: Creep) {
            StateManager.run(creep, states);
        }
    }
}
