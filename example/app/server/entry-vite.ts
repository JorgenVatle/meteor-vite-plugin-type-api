import { createLogger } from '@wcaservices/logger';
import { Meteor } from 'meteor/meteor';

const Logger = createLogger('App', {}, {
    msgPrefix: Meteor.isProduction ? '[PROD] ' : '[DEV] '
})

Logger.info(`Initializing application...`);

Meteor.startup(async () => {
    Logger.success('Meteor application initialized!');
});