const customerOrderDisplayId = Math.floor(
    Math.floor(1000000000 + Math.random() * 9000000)
).toString();
const now = new Date();
const isoDate = now.toISOString().substr(0, 10);

const customerOrderWithItems = {
    displayId: customerOrderDisplayId,
    orderDate: isoDate,
    items: [
        {
            id: '100001',
            subscriptionAspect: {
                validFrom: isoDate,
                contractTerm: {
                    period: 12,
                    periodicity: 'calendar-monthly',
                },
            },
        },
        {
            id: '100002',
            subscriptionAspect: {
                validFrom: isoDate,
                contractTerm: {
                    period: 12,
                    periodicity: 'calendar-monthly',
                },
            },
        },
    ],
};

const subscriptionAspectTechnicalResources = {
    subscriptionAspect: {
        technicalResources: [
            {
                resourceId: '514-1234567',
                resourceName: 'Time slice 12am - 7am',
            },
            {
                resourceId: '514-1234567',
                resourceName: 'Time slice 7.01am - 11.59pm',
            },
        ],
    },
};

module.exports = {
    customerOrderWithItems,
    subscriptionAspectTechnicalResources,
};
