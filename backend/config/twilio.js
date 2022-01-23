
import twilio from 'twilio';

let client;

const createClient = () => {
    client = twilio(process.env.ACCOUNTS_ID, process.env.AUTH_TOKEN);
};

export {
    createClient,
    client
};