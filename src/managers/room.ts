import {
   TowerManager
} from './tower'

import {
    SpawnerManager
} from './spawner';

function addRoomsFromSpawns() {
    if (!Memory.rooms) {
        Memory.rooms = {};
    }

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        SpawnerManager.run(spawn);

        Memory.rooms[spawn.room.name] = spawn.room;
    }
}

export interface IRoomLookup {
    [name: string]: Room;
}

export class RoomManager {
    static run() {
        addRoomsFromSpawns();

        for (var name in Memory.rooms) {
            var room = Memory.rooms[name];
            TowerManager.run(room);
        }
    }
}
