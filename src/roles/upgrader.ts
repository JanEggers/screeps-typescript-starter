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

export namespace Upgrader {
    export class Idle extends CreepState {
        constructor() {
            super(stateNames.idle);

        }
        checkTransition(creep: Creep){
            if (!creep.room.controller) {
                return stateNames.idle;
            }

            StateManager.setTarget(creep, creep.room.controller);
            return stateNames.approching;
        }

        run(creep: Creep) {
            delete creep.memory.needsEnergy;
        }
    }

    export class Working extends CreepState {
        constructor() {
            super(stateNames.working);

        }

        checkTransition(){
            return stateNames.working;
        }

        run(creep: Creep) {
            creep.memory.needsEnergy = true;

            if (!creep.room.controller) {
                return;
            }

            creep.upgradeController(creep.room.controller);
        }
    }

    var states: ICreepStateLookup = {
        idle: new Idle(),
        approching: approching,
        working: new Working(),
    }

    export class Upgrader implements IRole {
        static roleName = 'Upgrader';

        roleName = Upgrader.roleName;
        body = [MOVE,CARRY,WORK];
        grow = [MOVE,CARRY,WORK];
        max = 1;

        run(creep: Creep) {
            StateManager.run(creep, states);
        }
    }
}
