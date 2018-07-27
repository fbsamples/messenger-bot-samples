# Measuring customer satisfaction on Messenger

*Keywords: customer satisfaction, nps, csat, handover protocol, facebook analytics*

## Overview
This project is a simple customer care blueprint for the Messenger Platform which demonstrates how developers can add **agent support** to their bots and **measure customer satisfaction**.

The commonly used NPS (Net Promoter Score) and CSAT (Customer Satisfaction) survey types are already pre-configured. Results of the customer satisfaction survey are logged in [Facebook Analytics](https://analytics.facebook.com).

The code in this repository includes:
- a chat bot in a handover protocol setup with a secondary app that demonstrates how to transfer users to a live agent.

This solution is agnostic to the specific software that agents work with, as long as it implements the [Handover Protocol](https://developers.facebook.com/docs/messenger-platform/handover-protocol) of the Messenger Platform. The agent interface used in this blueprint is Facebook's Page Inbox.

Features of this blueprint:

- Intended to receive all incoming messages as primary receiver.
- Uses built-in NLP to determine the intent of a message.
- Handover between bot and customer care agents as needed.
- Conducts a CSAT survey after user interaction with the agent.
- CSAT results are logged in FBA (and can also be logged in other systems).

## Running the application

1. Clone or download this repository
2. Change to the `customer-care-csat` folder: `cd customer-care-csat`
3. Create `config/config.js` and run the application locally with `npm run start`, or deploy the project to a remote server of your choice and set the environment variables listed below.
4. Register the webhook URL in your Facebook app that receives your page's messages. Check the [App Setup Guide](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup) for details.

### Environment variables

- `MESSENGER_ENDPOINT`: The endpoint that is added to your host. Defaults to "/webhook".  
- `MESSENGER_VERIFY_TOKEN`: Verification token that is used for the [app setup](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup).   
- `PORT`: Set manually or omit to inherit from the environment.  
- `MESSENGER_APP_SECRET`: A unique secret associated with your application that authenticates requests made by your application to Facebook servers. Your App Secret should be treated like a password.  
- `MESSENGER_PAGE_ACCESS_TOKEN`: Token that allows the app to send messages on behalf of the page (must contain the scope pages_messaging).  
- `APP_ID`: ID of the Facebook app that points to this webhook.  
- `PAGE_ID`: ID of the Facebook page this application serves.  
- `SURVEY_TYPE`: Can either be 'NPS' or 'CSAT'.  
- `CUSTOMER_SERVICE_APP_ID`: ID of the app that handles user-agent conversations. 263902037430900 is the default Facebook page inbox.

### More Resources

To learn more about the Messenger Platform, check out these other resources:

- **[📚 Docs Docs Docs](https://developers.facebook.com/docs/messenger-platform/)**: Learn about all the features available for building awesome Messenger experiences.
- **[📱 Advanced Sample Apps](https://github.com/fbsamples/messenger-bot-samples)**: Download our samples that show off some of the Platform's most popular features.
- **[😺 Developer Community](https://www.facebook.com/groups/messengerplatform/)**: Join our developer community! Get help. Give help. Ship ❤️
- **[🗣 Handover Protocol Tutorial](https://blog.messengerdevelopers.com/tutorial-adding-live-chat-via-the-page-inbox-with-the-handover-protocol-aea2ede75fd)**: Learn how to pass control of a conversation from a bot to the Page Inbox.
