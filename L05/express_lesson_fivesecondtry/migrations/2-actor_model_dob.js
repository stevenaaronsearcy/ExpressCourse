'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "DOB" to table "actor"
 *
 **/

var info = {
    "revision": 2,
    "name": "actor_model_dob",
    "created": "2021-04-13T02:15:32.079Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "actor",
        "DOB",
        {
            "type": Sequelize.DATEONLY,
            "field": "DOB",
            "allowNull": true
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
