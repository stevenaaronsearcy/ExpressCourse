'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Deleted" to table "users"
 *
 **/

var info = {
    "revision": 2,
    "name": "second_migration",
    "created": "2021-04-17T08:12:24.491Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "users",
        "Deleted",
        {
            "type": Sequelize.BOOLEAN,
            "field": "Deleted",
            "default": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
