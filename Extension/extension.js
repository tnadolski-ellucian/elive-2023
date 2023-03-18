module.exports = {
    "name": "Extension",
    "publisher": "Tyler",
    "configuration": {
        client: [{
            key: 'baseApiUrl',
            label: 'Base Api Url',
            type: 'string',
            required: true
        }]
    },
    "cards": [{
        "type": "ExtensionCard",
        "source": "./src/cards/ExtensionCard",
        "title": "Extension Card",
        "displayCardType": "Extension Card",
        "description": "This is an introductory card to the Ellucian Experience SDK",
        "pageRoute": {
            "route": "/",
            "excludeClickSelectors": ['label', 'input']
        }
    }],
    "page": {
        "source": "./src/page/router.jsx",
        backgroundColor: "neutral",
        fullWidth: true
    }
}