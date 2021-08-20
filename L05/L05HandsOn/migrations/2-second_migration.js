'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "default_price" to table "category"
 *
 **/

var info = {
    "revision": 2,
    "name": "second_migration",
    "created": "2021-04-13T03:56:17.956Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "category",
        "default_price",
        {
            "type": Sequelize.DECIMAL,
            "field": "default_price",
            "allowNull": false
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
