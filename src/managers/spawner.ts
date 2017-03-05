import {
    roles
} from './../roles/index';


import {
    StructureSpawnMemory,
    IRoleMemory
} from './../contracts';

export class SpawnerManager {
    static run(spawn: Spawn) {
        //console.log("spawn");
        for(var rolename in roles) {
            var role = roles[rolename];
            //console.log("spawn", role);

            var members = _.filter(Game.creeps, (creep) => creep.memory.role == role.roleName);

            //console.log(role, members.length);
            var memory = <StructureSpawnMemory>spawn.memory;

            if (!memory.roles) {
                memory.roles = {};
            }

            var rolememory = memory.roles[rolename];
            if (!rolememory) {
                rolememory = memory.roles[rolename] = <IRoleMemory>{};
            }

            if (!rolememory.body) {
                rolememory.body = role.body;
            }

            if (role.grow && spawn.room.energyAvailable > (spawn.room.energyCapacityAvailable - 50)) {
                var growingBody = rolememory.body.concat(role.grow);
                while (spawn.canCreateCreep(growingBody, undefined) == OK) {
                    rolememory.body = growingBody;
                    console.log(role.roleName, 'grow:', rolememory.body);
                    growingBody = rolememory.body.concat(role.grow);
                }
            }

            if (members.length >= role.max) {
                var weaklings = _.filter(members, (creep) => creep.body.length < rolememory.body.length);
                if (weaklings.length > 0) {
                    console.log(weaklings[0].name,'as a',role.roleName,'is too weak-> suicide');
                    weaklings[0].suicide();
                    return;
                }
                else if (members.length && members.length > role.max) {
                    console.log(members[0].name,'as a',role.roleName,'too many creeps of this kind -> suicide');
                    members[0].suicide();
                    return;
                }
            } else if(spawn.canCreateCreep(rolememory.body, undefined) == OK) {
                var newName = spawn.createCreep(rolememory.body, undefined, {role: role.roleName});
                console.log('Spawning new', role.roleName, ':', newName,'with body', rolememory.body);
                return;
            }
            else if (!members.length && rolememory.body.length > role.body.length && !spawn.spawning) {
                console.log(role.roleName, 'reset size because of extinction');
                rolememory.body = role.body;
            }
        }
	}
}
