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

export namespace Builder {
    export class Idle extends CreepState {
        constructor() {
            super(stateNames.idle);

        }

        checkTransition(creep: Creep){
            var target = creep.pos.findClosestByPath<Resource>(FIND_CONSTRUCTION_SITES);
            if (target) {
                return StateManager.setTarget(creep, target);
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
            var target = Game.getObjectById<ConstructionSite>(creep.memory.targetId);

            if (target && target.progress < target.progressTotal) {
                return  stateNames.working;
            }

            creep.memory.target = null;;
            creep.memory.targetId = null;
            return stateNames.idle;
        }

        run(creep: Creep) {
            var target = Game.getObjectById<ConstructionSite>(creep.memory.targetId);
            if (!target) {
                return;
            }

            creep.memory.needsEnergy = true;
            creep.build(target);
        }
    }

    var states: ICreepStateLookup = {
        idle: new Idle(),
        approching: approching,
        working: new Working(),
    }

    export class Builder implements IRole {
        static roleName = 'Builder';

        roleName = Builder.roleName;
        body = [MOVE,CARRY,WORK];
        grow = [MOVE,CARRY,WORK];
        max =  1;

        run(creep: Creep) {
            StateManager.run(creep, states);
        }
    }

}
