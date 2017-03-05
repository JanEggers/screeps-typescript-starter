export function getFreeTerrainAround(room: Room, pos: RoomPosition) {
    var count = 0;
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            var terrain = room.lookForAt<string>(LOOK_TERRAIN, pos.x + x, pos.y + y);
            if (terrain[0] == "plain") {
                count++;
            }
        }
    }
    return count;
}
