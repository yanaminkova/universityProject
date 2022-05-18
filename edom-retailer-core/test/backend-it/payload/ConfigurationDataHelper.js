const requestConfig = { auth: '' };
let requestExecutioner;

async function createConfigurationDataSet(user, reqExecutioner) {
    requestConfig.auth = user;
    requestExecutioner = reqExecutioner;

    await createCountryCodes([
        ['USA', 'United States of America', 'US'],
        ['Germany', 'Deutchland', 'DE'],
        ['Canada', 'Canada (CA)', 'CA'],
    ]);

    await createLanguageCodes([
        ['English', 'English (US)', 'en'],
        ['France', 'France (CA)', 'fr'],
        ['German', 'Deutch', 'de'],
    ]);

    await createCurrencyCodes([
        ['Euro', 'Europian Union Euro', 'EUR'],
        ['US Dollar', 'United States of America Dollar', 'USD'],
        ['Ca. Dollar', 'Canadian Dollar', 'CAD'],
    ]);

    await createAcademicTitleCodes([
        ['Dr.', 'Doctor', '0002'],
        ['Mr.', 'Mister', '0004'],
        ['Mrs.', 'Missis', '0005'],
    ]);

    await createIncotermsClassificationCodes([
        [
            'Ex Works',
            'Can be used for any transport mode, or where there is more than one transport mode',
            'EXW',
        ],
        ['FH', 'FH', 'FH'],
    ]);

    await createBusinessPartnerRoleCodes([
        ['MKK', 'MKK', 'MKK'],
        ['UKM000', 'UKM000', 'UKM000'],
        ['FLCU00', 'FLCU00', 'FLCU00'],
        ['FLCU01', 'FLCU01', 'FLCU01'],
    ]);

    await createGenderCodes([
        ['Unknown', 'Unknown', '0'],
        ['Male', 'Male', '1'],
        ['Female', 'Female', '2'],
    ]);
}

function createConfPayloads(lines) {
    return lines.map((line) => {
        const [name, descr, code] = line;
        return {
            name,
            descr,
            code,
        };
    });
}

async function postRequest(url, data) {
    await requestExecutioner(url, data, requestConfig).catch((e) => {
        console.dir(e);
    });
}

async function createCountryCodes(codeLines) {
    const url = `/api/config/v1/CountryCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createLanguageCodes(codeLines) {
    const url = `/api/config/v1/LanguageCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createAcademicTitleCodes(codeLines) {
    const url = `/api/config/v1/AcademicTitleCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createIncotermsClassificationCodes(codeLines) {
    const url = `/api/config/v1/IncotermsClassificationCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createGenderCodes(codeLines) {
    const url = `/api/config/v1/GenderCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createCurrencyCodes(codeLines) {
    const url = `/api/config/v1/CurrencyCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

async function createBusinessPartnerRoleCodes(codeLines) {
    const url = `/api/businessPartner/v1/config/BusinessPartnerRoleCodes`;
    const payloads = createConfPayloads(codeLines);
    for (let i = 0; i < payloads.length; i += 1) {
        await postRequest(url, payloads[i]);
    }
}

module.exports = {
    createConfigurationDataSet,
    createCountryCodes,
    createLanguageCodes,
    createAcademicTitleCodes,
    createIncotermsClassificationCodes,
    createCurrencyCodes,
    createGenderCodes,
    createBusinessPartnerRoleCodes,
};
