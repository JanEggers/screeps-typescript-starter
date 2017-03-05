export interface IRoleMemory {
    body: string [];
}

export interface IRoleMemoryLookup {
    [name: string]: IRoleMemory;
}

export interface StructureSpawnMemory {
    roles: IRoleMemoryLookup;
}


export interface CreepMemory {
    state: string;

    target: RoomPosition;
    targetId: string;

    role: string;
}
