(function() {
    const telegramBot = require('node-telegram-bot-api');
    const {config} = require('../config/config.js');
    const models = require('../models');
    const CommandParser = require('./commandParser.js');
    const token = config.token || process.argv[2];
    const Message = require('./message.js');

    let bot = new telegramBot(token, {polling: true});
    let commandParser = new CommandParser(bot);

    models.sequelize.sync().then(function () {
        console.log('DB Initialisation successfull');

        bot.on('message', onNewMessage);
        bot.on('new_chat_participant', function (msg) {
            if (msg.new_chat_participant.id === config.myId) {
                invitedToNewChat(msg.chat);
            }
        })
    }, function (error) {
        console.log(error);
    });

    function onNewMessage(msg) {
        debugger;
        let chatId = msg.chat.id;
        if (commandParser.isCommand(msg)) {
            console.log('command');
        } else {
            new Message(bot, msg);
        }
    }

    function invitedToNewChat(chat) {
        console.log(chat);
    }
})();