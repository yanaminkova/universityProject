/**
 * @typedef {import('./CloudEventMessage')} CloudEventMessage
 *
 * @namespace srv.event
 * @class CloudEventMessageBuilder
 * @classdesc Builder for CloudEventMessage
 */

const { HTTP, CloudEvent } = require('cloudevents');
const { TextBundle } = require('@sap/textbundle');
const { handleError } = require('../lib/error');

const bundle = new TextBundle('../../_i18n/i18n');

class CloudEventMessageBuilder {
    /**
     * @description
     * this.queueSplitString is using for extract source name from the queue name
     * and for creating correct topic names
     */
    constructor() {
        this.loggerScope = '[CloudEventMessageBuilder]';
        this.queueSplitString = '/-/';
    }

    /**
     *
     * @param {Error|String} e - error to throw and log
     * @param {*} info - debug info for logger.debug, recursive objects are prohibited
     */
    handleError(e, info = null) {
        handleError(e, null, 500, this.loggerScope, info);
    }

    /**
     *
     * @param {Object} msg
     * @returns {CloudEventMessageBuilder}
     */
    setMessage(msg) {
        if (!msg || Object.getOwnPropertyNames(msg).length === 0) {
            this.handleError(
                `${bundle.getText('errorMsgCloudEventEmptyMsg')}`,
                msg
            );
        }

        this.message = msg;
        return this;
    }

    /**
     *
     * @param {cds.Service} messaging - instance of messaging
     * @returns {CloudEventMessageBuilder}
     */
    setSource(messaging) {
        let { queueName } = messaging;
        queueName = queueName || '/default';
        if (typeof queueName !== 'string' || !queueName) {
            this.handleError(
                `${bundle.getText('errorMsgCloudEventQueueNameType')}`,
                messaging.options
            );
        }

        const split = queueName.split(this.queueSplitString);
        this.source = `/${split.length > 0 ? split[0] : ''}`;
        return this;
    }

    setSubject(subject) {
        if (typeof subject !== 'string' || !subject) {
            this.handleError(
                `${bundle.getText('errorMsgCloudEventSubjectType')}`,
                subject
            );
        }

        this.subject = subject;
        return this;
    }

    /**
     *
     * @param {String} type
     * @returns {CloudEventMessageBuilder}
     */
    setType(type) {
        if (typeof type !== 'string' || !type) {
            this.handleError(
                `${bundle.getText('errorMsgCloudEventTypeType')}`,
                type
            );
        }

        this.type = type;
        return this;
    }

    /**
     * @description provides default debug info
     * @returns {[String, String, String]}
     */
    get info() {
        return {
            type: this.type,
            source: this.source,
        };
    }

    /**
     * Builds the Cloud event message
     */
    build() {
        if (!this.type || !this.source || !this.subject) {
            this.handleError(
                `${bundle.getText('errorMsgCloudEventInvalidParameter')}`,
                this.info
            );
        }

        const ce = new CloudEvent({
            type: this.type,
            source: this.source,
            subject: this.subject,
            datacontenttype: 'appplication/json',
        });

        return HTTP.structured(ce);
    }
}

module.exports = CloudEventMessageBuilder;
