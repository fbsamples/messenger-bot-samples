"use strict";

const COMMAND_PAYLOADS = {
    customer_care_accept: "customer_care_accept",
    customer_care_reject: "customer_care_reject",
    customer_care_cancel: "customer_care_cancel",
    persistent_menu_agent_cta_payload: "customer_care_request",
};

const CSAT_QUICK_REPLIES = [
    {
        title: "N/A",
        payload: "csat_not_applicable",
    },
    {
        title: "Very unsatisfied",
        payload: "csat_very_unsatisfied",
    },
    {
        title: "Unsatisfied",
        payload: "csat_unsatisfied",
    },
    {
        title: "Neutral",
        payload: "csat_neutral",
    },
    {
        title: "Satisfied",
        payload: "csat_satisfied",
    },
    {
        title: "Very satisfied",
        payload: "csat_very_satisfied",
    },
];

const NPS_QUICK_REPLIES = [
    {
        title: "0 (not likely)",
        payload: "nps_0",
    },
    {
        title: "1",
        payload: "nps_1",
    },
    {
        title: "2",
        payload: "nps_2",
    },
    {
        title: "3",
        payload: "nps_3",
    },
    {
        title: "4",
        payload: "nps_4",
    },
    {
        title: "5 (neutral)",
        payload: "nps_5",
    },
    {
        title: "6",
        payload: "nps_6",
    },
    {
        title: "7",
        payload: "nps_7",
    },
    {
        title: "8",
        payload: "nps_8",
    },
    {
        title: "9",
        payload: "nps_9",
    },
    {
        title: "10 (very likely)",
        payload: "nps_10",
    },
];

const CONFIRM_HANDOVER_QUICK_REPLIES = [
    {
        title: "Yes",
        payload: COMMAND_PAYLOADS.customer_care_accept,
    },
    {
        title: "No, thank you",
        payload: COMMAND_PAYLOADS.customer_care_reject,
    },
];

module.exports = {
    COMMAND_PAYLOADS,
    CSAT_QUICK_REPLIES,
    NPS_QUICK_REPLIES,
    CONFIRM_HANDOVER_QUICK_REPLIES,
}
