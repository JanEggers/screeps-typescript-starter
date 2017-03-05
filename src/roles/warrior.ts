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

export namespace Warrior {
    var patrol = function(creep: Creep) {
        var targets = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
            filter: (structure: Structure) => {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });

        if (targets.length && creep.memory.targetId == targets[0].id) {
            targets = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType == STRUCTURE_CONTROLLER;
                }
            });
        }

        if (targets.length) {
            return targets[0];
        }
    }

    export class Idle extends CreepState {
        constructor() {
            super(stateNames.idle);

        }

        checkTransition(creep: Creep){
            StateManager.setTarget(creep, patrol(creep));
            return stateNames.approching;
        }

        run() {
        }
    }

    export class Working extends CreepState {
        constructor() {
            super(stateNames.working);

        }

        checkTransition() {
            return stateNames.idle;
        }

        run() {
        }
    }

    var states: ICreepStateLookup = {
        idle: new Idle(),
        approching: approching,
        working: new Working(),
    }

    export class Warrior implements IRole {
        static roleName = 'Warrior';

        roleName = Warrior.roleName;
        body = [ATTACK,MOVE];
        grow = [ATTACK,MOVE];
        max = 3;

        run(creep: Creep) {
            var closestHostile = creep.room.find<Creep>(FIND_HOSTILE_CREEPS);
            if(closestHostile.length) {
                if (creep.attack(closestHostile[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile[0]);
                }
            } else {
                var state = StateManager.transition(creep, states);
                //console.log(creep.name, state);
                //console.log(creep.name, creep.memory.target);
                states[state].run(creep);
            }
        }
    }
}
