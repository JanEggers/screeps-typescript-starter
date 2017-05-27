import { RoomManager } from './managers/index';


import { KeepAlive, roles } from './roles/index';


/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    RoomManager.run();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!KeepAlive(creep)) {
            var role = roles[creep.memory.role];

            if (role) {
                role.run(creep);
            } else {
                console.log(creep.name + ' has an invalid role ' + creep.memory.role);
                creep.suicide();
            }
        }
    }
}
