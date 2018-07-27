"use strict";

const request = require("request");

class FBA {
    constructor(config) {
        if (!config) {
            config = {};
        }
        this.app_id = config.app_id;
        this.page_id = config.page_id;
    }

    logCSATResponse(rating, psid) {
        const event = {
            _eventName: "customer_care_csat",
            rating: rating,
        }
        return this.logCustomEvent(psid, event);
    }

    logNPSResponse(rating, psid) {
        const event = {
            _eventName: "customer_care_nps",
            rating: rating,
        }
        return this.logCustomEvent(psid, event);
    }

    logCustomEvent(psid, event) {
        return new Promise (async (resolve, reject) => {
            if (!psid) {
                reject("PSID required");
            }
            if (!event) {
                reject("Event undefined");
            }
            if (!this.app_id) {
                reject("App ID not initialized");
            }
            if (!this.page_id) {
                reject("Page ID not initialized");
            }
        
            request.post(
                {
                    url : `https://graph.facebook.com/${this.app_id}/activities`,
                    form: {
                        event: "CUSTOM_APP_EVENTS",
                        custom_events: JSON.stringify([event]),
                        advertiser_tracking_enabled: 1,
                        application_tracking_enabled: 1,
                        extinfo: JSON.stringify(["mb1"]),
                        page_id: this.page_id,
                        page_scoped_user_id: psid
                    }
                }, (error, response, body) => { 
                    if (error) {
                        reject(error, body);
                    }
                    if (body.error) {
                        reject(body);
                    }
                    if (typeof body === "string") body = JSON.parse(body);
                    resolve(body);
                }
            );
        });
    }
}

module.exports = FBA;
