roleBuilder = require('role.builder')

var roleHarvester = {

    run: function (creep) {
        if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
            creep.memory.working = true;
            creep.say('spawn');
        }
        else if (creep.carry.energy == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION
                || s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
        });

            if (structure == undefined) {
                structure = creep.room.storage;
            }

            // if we found one
            else if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            } else {
                roleBuilder.run(creep)
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
