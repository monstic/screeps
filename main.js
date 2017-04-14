// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleHealer = require('role.healer');
var roleBuilder = require('role.builder');
var gc = require("gc");

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            Memory.creeps[name] = undefined;
        }
    }
    for(var name in Memory.rooms) {
        if(!Game.rooms[name]) {
            Memory.rooms[name] = undefined;
        }
    }

    // for every creep name in Game.creeps
    for (var name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }
    }

    // goal: have 10 harvesters and as many upgraders as possible
    var minimumNumberOfHarvesters = 4;
    var minimumNumberOfUpgraders = 8;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfHealers = 1;
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Matriz.createCreep([WORK,CARRY,CARRY,MOVE], undefined,
            { role: 'harvester', working: false});
        if(name >= -1000000) {
        } else {
            console.log('Spawning new harvester: ' + name);
        }
    }
    else {
        // else try to spawn an upgrader
        // small change from what you saw in the video: for upgraders it makes
        //  more sense to have two move parts because they have to travel further
        if (numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.Matriz.createCreep([WORK,CARRY,CARRY,MOVE], undefined,
            { role: 'upgrader', working: false});
            if(name >= -1000000) {
            } else {
                console.log('Spawning new upgrader: ' + name);
            }
        } else {
            if (numberOfBuilders < minimumNumberOfBuilders) {
            name = Game.spawns.Matriz.createCreep([WORK,WORK,CARRY,MOVE], undefined,
                { role: 'builder', working: false});
                if(name >= -1000000) {
                } else {
                    console.log('Spawning new builder: ' + name);
                }
            } else {
                if (numberOfHealers < minimumNumberOfHealers) {
                    name = Game.spawns.Matriz.createCreep([WORK,CARRY,MOVE,MOVE], undefined,
                        { role: 'healer', working: false});
                    if(name >= -1000000) {
                    } else {
                        console.log('Spawning new healer: ' + name);
                    }
                }
            }
        }
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false

};
