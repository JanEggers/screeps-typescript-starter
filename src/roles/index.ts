export * from './builder'
export * from './harvester'
export * from './keepAlive'
export * from './miner'
export * from './repair'
export * from './transport'
export * from './upgrader'

import { Builder } from './builder'
import { Harvester } from './harvester'
import { IRoleLookup } from './role'
import { Miner } from './miner'
import { Repair } from './repair'
import { Transport } from './transport'
import { Upgrader } from './upgrader'


export function create(): IRoleLookup {
  var result = <IRoleLookup>{};

  result[Builder.Builder.roleName] = new Builder.Builder();
  result[Harvester.roleName] = new Harvester();
  result[Miner.roleName] = new Miner();
  result[Repair.roleName] = new Repair();
  result[Transport.Transport.roleName] = new Transport.Transport();
  result[Upgrader.Upgrader.roleName] = new Upgrader.Upgrader();

  return result;
}


export var roles = create();
