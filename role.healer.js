roleUpgrader = require('role.upgrader')

var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
            creep.memory.working = true;
            creep.say('heal');
        }
        else if (creep.carry.energy == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.say('harvest');
        }

        if(creep.memory.working) {
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.hits < structure.hitsMax 
                }
            })
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                if (targets.length) {
                    target = creep.pos.findClosestByPath(targets)
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ccc'}});
                    }
                } else {
                    roleUpgrader.run(creep)
                }
            } else {
                target = creep.pos.findClosestByPath(targets)
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ccc'}});
            }
        }
        else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = roleHealer;
