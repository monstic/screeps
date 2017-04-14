var roleUpgrader = {

    run: function (creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
            creep.memory.working = true;
            creep.say('upgrade');
        }
        else if (creep.carry.energy == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.say('harvest');
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        } else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleUpgrader;