const CloudEventMessageBuilder = require('../../../srv/event/CloudEventMessageBuilder');
const { TextBundle } = require('@sap/textbundle');
const expect = require('expect');
const bundle = new TextBundle('../../../_i18n/i18n');

describe('CloudEventMessageBuilder.test UTILITIESCLOUDSOLUTION-2843', () => {
    const fakeMessaging = { queueName: 'mySource/-/myQueueName' };

    it('should create default message with type and source', async () => {
        const cloudEventMessage = new CloudEventMessageBuilder()
            .setType('myType')
            .setMessage('test123')
            .setSource(fakeMessaging)
            .setSubject('99999999')
            .build();

        expect(cloudEventMessage.body).toBeTruthy();

        const messageBody = JSON.parse(cloudEventMessage.body);

        expect(messageBody.subject).toEqual('99999999');
        expect(messageBody.source).toEqual('/mySource');
    });

    it('should throw an error with no empty messages', async () => {
        expect(() => {
            new CloudEventMessageBuilder().setMessage('').build();
        }).toThrowError(`${bundle.getText('errorMsgCloudEventEmptyMsg')}`);
    });

    it('should throw an error with invalid parameters', async () => {
        expect(() => {
            new CloudEventMessageBuilder().build();
        }).toThrowError(
            `${bundle.getText('errorMsgCloudEventInvalidParameter')}`
        );
    });

    it('should throw an error with type is not a String', async () => {
        expect(() => {
            new CloudEventMessageBuilder()
                .setType('')
                .setSubject('99999999')
                .build();
        }).toThrowError(`${bundle.getText('errorMsgCloudEventTypeType')}`);
    });

    it('should throw an error with source is not a String', async () => {
        expect(() => {
            new CloudEventMessageBuilder()
                .setType('myType')
                .setSource({ queueName: 1 })
                .setSubject('99999999')
                .build();
        }).toThrowError(`${bundle.getText('errorMsgCloudEventQueueNameType')}`);
    });

    it('should throw an error with empty Object', async () => {
        expect(() => {
            new CloudEventMessageBuilder()
                .setType('myType')
                .setSubject()
                .build();
        }).toThrowError(`${bundle.getText('errorMsgCloudEventSubjectType')}`);
    });
});
