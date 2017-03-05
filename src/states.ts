export abstract class CreepState {
    constructor(public stateName: string) {

    }

    abstract checkTransition( creep: Creep ) : string;

    abstract run(creep: Creep): void;
}

export var stateNames = {
    idle: 'idle',
    approching: 'approching',
    working: 'working',
}

class Approching extends CreepState {
    constructor() {
        super(stateNames.approching);
    }

    checkTransition(creep: Creep){
        if (creep.pos.isNearTo(creep.memory.target.x,creep.memory.target.y)) {
            return stateNames.working;
        }

        return stateNames.approching;
    }

    run(creep: Creep) {
        creep.moveTo(creep.memory.target.x,creep.memory.target.y);
    }
}

export var approching = new Approching();

export interface ICreepStateLookup {
    [name: string]: CreepState;
}

export class StateManager {
    static run(creep: Creep, states: ICreepStateLookup) {
        try {
            states[StateManager.transition(creep, states)].run(creep);
        } catch (e) {
            creep.memory.state = "idle";
            throw e;
        }
    }

    static transition(creep: Creep, states: ICreepStateLookup) {
        var lastState = creep.memory.state;
        var nextState = lastState;
        if (!lastState) {
            lastState = nextState = "idle";
        }

        nextState = states[lastState].checkTransition(creep);
        if (nextState != lastState) {
            creep.memory.state = nextState;
            //console.log(creep.name, "transition to", nextState);
        }

        return nextState;
    }

    static setTarget(creep: Creep, target: Resource | Structure | Creep | StructureController | undefined){
        if (target) {
            creep.memory.target = target.pos;
            creep.memory.targetId = target.id;
        }
        //console.log(creep.name, "targets", target.name, "at", target.pos);

        return stateNames.approching;
    }
}
