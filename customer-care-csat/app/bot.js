"use strict";

const PAYLOADS = require("./payloads.js");

class Bot {
    constructor(bot_config) {
        this.fba_client = bot_config.fba_client;
        this.messenger_client = bot_config.messenger_client;
        this.customer_service_app_id = bot_config.customer_service_app_id;
        this.survey_type = bot_config.survey_type;
    }

    async handleText(event_type, sender_info, webhook_event) {
        let recipient = {
            id: sender_info.value,
        };

        // Determine which action to take
        if (webhook_event.message &&
            webhook_event.message.quick_reply) {
            // Check if user responded to CSAT or NPS survey
                if ((PAYLOADS.CSAT_QUICK_REPLIES.map(qr => qr.payload).includes(webhook_event.message.quick_reply.payload) ||
                PAYLOADS.NPS_QUICK_REPLIES.map(qr => qr.payload).includes(webhook_event.message.quick_reply.payload))
            ) {
                try {
                    const rating = webhook_event.message.quick_reply.payload;
                    switch (this.survey_type) {
                        case "CSAT":
                            console.log(`Logging CSAT rating "${rating}" for user ${recipient.id}`);
                            this.fba_client.logCSATResponse(rating, recipient.id);
                            break;
                        case "NPS":
                            console.log(`Logging NPS rating "${rating}" for user ${recipient.id}`);
                            this.fba_client.logNPSResponse(rating, recipient.id);
                            break;
                    }
                    this.messenger_client.sendText(
                        recipient,
                        "Thank you for your feedback!"
                    );
                } catch(e) {
                    console.error(e);
                }
            }

            // Check if user responded to "Do you want to talk to an agent?"
            else if (PAYLOADS.CONFIRM_HANDOVER_QUICK_REPLIES.map(qr => qr.payload).includes(webhook_event.message.quick_reply.payload)) {
                if (webhook_event.message.quick_reply.payload === PAYLOADS.COMMAND_PAYLOADS.customer_care_accept) {
                    // User requested to talk to an agent -> hand over to the customer service app
                    try {
                        // Let user know that we are handing over
                        await this.messenger_client.sendText(
                            recipient,
                            "Okay, I am connecting you with an agent. That could take a couple of minutes - you will be notified as soon as possible.",
                        );

                        // Pass thread control to the secondary receiver
                        await this.messenger_client.passThreadControl(
                            recipient.id,
                            this.customer_service_app_id,
                            "some-handover-metadata",
                        );

                        // Send a Quick Reply so that the user can cancel the request if needed
                        let text = "In the meantime, you can send additional context or cancel your request if you don't need help anymore.";
                        let quick_replies = [
                            {
                                content_type: "text",
                                title: "Cancel request",
                                payload: PAYLOADS.COMMAND_PAYLOADS.customer_care_cancel,
                            }
                        ];
                        await this.messenger_client.sendQuickReplies(recipient, quick_replies, text);
                    } catch (e) {
                        console.error("Error while handing over thread control to secondary receiver.");
                    }
                }
                else if (webhook_event.message.quick_reply.payload === PAYLOADS.COMMAND_PAYLOADS.customer_care_reject) {
                    // User rejected the offer to talk to an agent
                    try {
                        await this.messenger_client.sendText(
                            recipient,
                            "Okay, you can keep exploring the bot. 👩‍💻",
                        );
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        // Direct request for agent through persistent menu or text entry
        else if ((webhook_event.postback &&
            webhook_event.postback.payload === PAYLOADS.COMMAND_PAYLOADS.persistent_menu_agent_cta_payload) ||
            webhook_event.message.text.includes("talk") && webhook_event.message.text.includes("agent")
        ) {
            const quick_replies = PAYLOADS.CONFIRM_HANDOVER_QUICK_REPLIES.map(qr => {
                return {
                    content_type: "text",
                    title: qr.title,
                    payload: qr.payload,
                }
            });

            try {
                this.messenger_client.sendQuickReplies(
                    recipient,
                    quick_replies,
                    "Do you want me to hand you over to our customer service?");
            } catch(e) {
                console.error(e);
            }
        }
        
        else if (webhook_event.message) {
            // Catch all section. Any special commands would have been processed above.
            // Use built-in NLP to determine what the user wants.
            let ents = null;
            const nlpThreshold = 0.9;

            if (webhook_event.message.nlp) {
                console.log("NLP data:");
                console.log(JSON.stringify(webhook_event.message.nlp));
                ents = webhook_event.message.nlp.entities;
            }

            if (ents && ents.greetings && ents.greetings[0].confidence > nlpThreshold) {
                await this.messenger_client.sendText(
                    recipient,
                    "Hi there! I'm a demo bot that doesn't know much, but I have smart human friends who can help if I cannot answer your question. 🤓",
                );
                await this.messenger_client.sendText(
                    recipient,
                    "How can I help you today?",
                );
            }

            else if (ents && ents.bye && ents.bye[0].confidence > nlpThreshold) {
                this.messenger_client.sendText(
                    recipient,
                    "Bye! It was a pleasure assisting you today. 👋",
                );
            }

            else if (ents && ents.thanks && ents.thanks[0].confidence > nlpThreshold) {
                this.messenger_client.sendText(
                    recipient,
                    "You are welcome! 👍",
                );
            }

            else if (webhook_event.message.text.includes("track") && webhook_event.message.text.includes("order")) {
                let generic_template = {
                    template_type: "generic",
                    elements: [
                        {
                            title: "How to track your order",
                            subtitle: "Never miss important shipping updates.",
                            image_url: "https://messenger.fb.com/wp-content/uploads/2018/02/gieofglobe_tableau.png",
                            default_action: {
                                type: "web_url",
                                url: "https://messenger.fb.com",
                                webview_height_ratio: "full",
                            },
                            buttons: [
                                {
                                    type: "web_url",
                                    url: "https://messenger.fb.com",
                                    webview_height_ratio: "full",
                                    title: "Track My Order",
                                }
                            ]
                        }
                    ]
                };
                   
                try {
                    this.messenger_client.sendTemplate(recipient, generic_template)
                } catch (e) {
                    console.error(e);
                }
            }

            else {
                const quick_replies = PAYLOADS.CONFIRM_HANDOVER_QUICK_REPLIES.map(qr => {
                    return {
                        content_type: "text",
                        title: qr.title,
                        payload: qr.payload,
                    }
                });
    
                try {
                    this.messenger_client.sendQuickReplies(
                        recipient,
                        quick_replies,
                        "I'm not quite sure what you mean by that. Would you like to talk to our customer service?");
                } catch(e) {
                    console.error(e);
                }
            }
        }
    }

    async handleHandover(event_type, sender_info, webhook_event) {
        let recipient = {
            id: sender_info.value,
        };

        if (webhook_event.pass_thread_control) {
            // Thread control has been passed back to the bot -> follow up with a survey.
            let text, raw_quick_replies;

            switch (this.survey_type) {
                case "CSAT":
                    test = "How satisfied are you with our service today?"
                    raw_quick_replies = PAYLOADS.CSAT_QUICK_REPLIES;
                    break;
                case "NPS":
                    text = "Based on your experience today, how likely is it that you would recommend us to a friend or colleague?"
                    raw_quick_replies = PAYLOADS.NPS_QUICK_REPLIES;
                    break;
            }
            
            try {
                const quick_replies = raw_quick_replies.map(response => {
                    return {
                        content_type: "text",
                        title: response.title,
                        payload: response.payload,
                    };
                });
                this.messenger_client.sendQuickReplies(recipient, quick_replies, text)
            } catch(e) {
                console.error(e);
            }
        }
    }

    async handleStandby(event_type, sender_info, webhook_event) {
        // These are events that are passed to the bot while customer service is dealing with the request.
        let recipient = {
            id: sender_info.value,
        };

        // Check whether the user wants to cancel the handover request and talk to the bot again.
        if ((webhook_event.message &&
            webhook_event.message.quick_reply &&
            webhook_event.message.quick_reply.payload === PAYLOADS.COMMAND_PAYLOADS.customer_care_cancel) ||
            webhook_event.postback && webhook_event.postback.payload === PAYLOADS.COMMAND_PAYLOADS.customer_care_cancel
        ) {
            try {
                await this.messenger_client.takeThreadControl(recipient.id, "Customer has requested that I take the thread control from you.");
                this.messenger_client.sendText(recipient, "You are now talking to the bot again. 🤖");
            } catch(e) {
                console.error(e);
            }
        }
        
        else {
            // You can listen for other user messages or commands here.
        }
    }
}

module.exports = Bot;
