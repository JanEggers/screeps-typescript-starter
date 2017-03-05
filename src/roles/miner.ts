import { findEnergySource } from './harvester';
import {
    IRole
} from './role';

export class Miner implements IRole {
    static roleName = 'Miner';

    roleName = Miner.roleName;
    body = [MOVE,WORK,WORK];
    grow = [MOVE,WORK,WORK];
    max = 2;

    run(creep: Creep) {
        var source = Game.getObjectById<Source>(findEnergySource(creep));
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
	}
}
