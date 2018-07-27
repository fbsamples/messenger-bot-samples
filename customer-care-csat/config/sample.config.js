const config = {
    webhook: {
        "endpoint": "/webhook",
        "verify_token": "VERIFICATION_TOKEN",
        "port": 9999,
        "app_secret": "APP_SECRET"
    },
    client: {
        "page_token": "PAGE_ACCESS_TOKEN"
    },
    fba: {
        "app_id": "APP_ID",
        "page_id": "PAGE_ID"
    },
    survey_type: "NPS", // Can be 'NPS' or 'CSAT'
    customer_service_app_id: "263902037430900" // 263902037430900 is the default Facebook page inbox
};

module.exports = config;
