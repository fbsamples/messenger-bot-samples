"use strict";

const Bot = require("./app/bot.js");
const FBA = require("./app/fba.js");
const MessengerSDK = require("messenger-node");

let config, webhook_config, client_config, fba_config;

try {
    console.log("Trying to read local configuration...");
    config = require("./config/config.js");
} catch (e) {
    console.log("Error while reading local configuration, reading environment variables instead.");
    config = {
        webhook: {
            "endpoint": process.env.MESSENGER_ENDPOINT,
            "verify_token": process.env.MESSENGER_VERIFY_TOKEN,
            "port": process.env.PORT,
            "app_secret": process.env.MESSENGER_APP_SECRET
        },
        client: {
            "page_token": process.env.MESSENGER_PAGE_ACCESS_TOKEN,
        },
        fba_config: {
            "app_id": process.env.APP_ID,
            "page_id": process.env.PAGE_ID,
        },
        survey_type: process.env.SURVEY_TYPE,
        customer_service_app_id: process.env.CUSTOMER_SERVICE_APP_ID
    };
}

const fba_client = new FBA(config.fba);
const messenger_client = new MessengerSDK.Client(config.client);
const webhook = new MessengerSDK.Webhook(config.webhook);

const bot_config = {
    "messenger_client": messenger_client,
    "fba_client": fba_client,
    "customer_service_app_id": config.customer_service_app_id,
    "survey_type": config.survey_type,
};

const bot = new Bot(bot_config);

webhook.on("messages", (event_type, sender_info, webhook_event) => {
    logEvent(event_type, sender_info, webhook_event);
    bot.handleText(event_type, sender_info, webhook_event);
});

webhook.on("messaging_postbacks", (event_type, sender_info, webhook_event) => {
    logEvent(event_type, sender_info, webhook_event);
    bot.handleText(event_type, sender_info, webhook_event);
});

webhook.on("messaging_handovers", (event_type, sender_info, webhook_event) => {
    logEvent(event_type, sender_info, webhook_event);
    bot.handleHandover(event_type, sender_info, webhook_event);
});

webhook.on("standby", (event_type, sender_info, webhook_event) => {
    logEvent(event_type, sender_info, webhook_event);
    bot.handleStandby(event_type, sender_info, webhook_event);
});

function logEvent(event_type, sender_info, webhook_event) {
    console.log("=== Webhook event: " + JSON.stringify(event_type) + " ===");
    console.log(webhook_event);
};
