const CloudEventMessageBuilder = require('./CloudEventMessageBuilder');

class EventMeshMessage {
    constructor(messaging, typeHashMap = {}, topicHashMap = {}) {
        this.messaging = messaging;
        this.typeHashMap = typeHashMap;
        this.topicHashMap = topicHashMap;
    }

    async emit(req, method, subject, message) {
        const type = this.typeHashMap[method];
        const cloudEventMessage = new CloudEventMessageBuilder()
            .setSource(this.messaging)
            .setType(type)
            .setSubject(subject)
            .build();

        await this.messaging
            .tx(req)
            .emit(
                `topic:${this.messaging.queueName || ''}/${
                    this.topicHashMap[method]
                }`,
                message,
                JSON.parse(cloudEventMessage.body)
            );
    }
}

module.exports = EventMeshMessage;
