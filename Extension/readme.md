# Create Experience Extension
This module bootstraps your Ellucian Experience Extension development by creating an extension project. This module is primarily used to create your initial project. From this, you would add cards and make modifications. This project should be placed under your source control.

## Quick Start
Ensure you're running node 16.15.0
```sh
npx https://cdn.elluciancloud.com/assets/SDK/latest/ellucian-create-experience-extension-latest.tgz my-extension
cd my-extension
npm install
```
For Unix based systems:
```
cp sample.env .env
```
For Windows based systems:
```
copy sample.env .env
```
In the .env replace <upload-token> with an extension token from Experience Setup.
```
npm run deploy-dev
```

At this point, you have deployed the updated builds. Please re-run `npm run deploy-dev` if you update `extension.js`, `package.json`, or add a new card.

**NOTE:** This is using the real Experience Dashboard so your extension will not be visible until it is fully set up. This means you must enable your extension in Experience Setup and configure your card(s) in the Dashboard. This will be required each time you change your extension's version number.

### Live reloading the extensions
With live reloading enabled, you can make changes to your extensions locally and see them reflected immediately in your extensions — no browser reload required. Also, in this mode, changes are served directly from your development machine. This should significantly speed up the build/test process. Make sure you have run `npm run deploy-dev` command once to upload the extensions.
```
npm start
```
The server uses local port `8082` to communicate with the Experience Dashboard, by default. If that port is not open — or you need to use a different one, for any reason — you can specify an override. To do this, create a `.env` file if not already created and add the `PORT` environment variable with the port value that is available and save the file. EX: `PORT=8989`. Now run the below command.
```
npm start
```

This will start the local development server of the extension on port `8082` or the port number you have provided in the `.env` file. Now you can open the Experience app on any instances such as https://experience-test.elluciancloud.com/.

To put the Experience app into live reload mode, follow the steps given below.
1. Open browser developer tools
2. Go to the console tab of developer tools.
3. Run this function `enableLiveReload([optional-port-number])` from the console tab. NOTE that if you have launched the extension app on port other than the default `8082` port then provide the same port number while enabling live reload for Experience app.
4. Refresh the Experience app.

After you refresh the app, the cool thing is that only your extensions will show up. Make sure to bookmark your extensions. Now when you make changes to your extension code, locally, you'll see those changes reflected automatically and instantly in your browser, for both cards and pages. There will be no need for an explicit browser reload.

To disable live reload, run this function `disableLiveReload()` from console tab.

**NOTE** that changes to extension metadata (`package.json` and `extension.json`) will not be automatically picked up by live reload, nor will newly-created cards and pages. To see these changes, run the below command. Notice the `forceUpload` command-line argument, this will force the assets to be uploaded with the same version.
```
npm run deploy-dev -- --env forceUpload
```
### Watch and upload extensions
The command `npm start` has been repurposed to put the extension app into live-reload mode. To watch the changes and automatically deploy the updated builds, you can run the below command.
```
npm run watch-and-upload
```
**NOTE:**  This is using the real Experience Dashboard so your extension will not be visible until it is fully set up. This means you must enable your extension in Experience Setup and configure your card(s) in the Dashboard. This will be required each time you change your extension's version number.

## Extension Manifest
When an Extension is bundled for uploading to Ellucian Experience, the information specified in the src folder (cards and i18n), package.json, and extension.js file are used to generate a manifest.json file which provides the Ellucian Experience framework the information it needs to handle the creation and management of the Extension and its Cards.

The extension.js file located in the root of the extension folder defines the Extension package containing one or more Cards. This includes identifying information about the Extension as a whole, configuration attribute definitions for the Extension, as well as Card-specific attributes for each Card contained in the Extension.

| Attribute | Description |
|-----------|-------------|
| publisher      | The organizational name of the extension publisher, such as 'Ellucian' or 'Drexel'|
| name           | The internal name of the Extension (this is not displayed to users) - should match the package.json name, but doesn't have to. Note this name should not change once the extension is in use. The extension name is used to generate a namespaced card ID.|
| configuration  | Define configuration values shared among the Extension Cards in this object. These configuration values appear in the Configure step when a card manager is configuring a Card contained in the Extension. |
| cards          | The list of Cards present in the Extension package.|

Each card in the cards array has several required attributes.

| Card Attribute  | Description |
|-----------------|-------------|
| type            | A unique key to identify the type of the Card. No spaces should appear in the type. Once the extension is distributed to users, you should not alter this value as it is a key identifier |
| configuration   | Define configuration values unique to the Card in this object. These configuration values appear in the Configure step when a card manager is configuring the Card. |
| description     | The default description of the Card. Card managers will be able to override this when configuring the Card for their users.|
| title           | The default title of the Card appearing to users in the Experience Dashboard. Card managers will be able to override this value when configuring the Card for their users.|
| source          | The file system path to the Card's source, relative from the Extension root folder. Example: './src/cards/HelloWorldCard' (with or without the .jsx)|
| displayCardType | The type of the card as displayed to card managers on the Card Management page of Experience Dashboard. Example: "Hello World Card"|

## Utilizing the Setup API
Any of the scripts which deploy the extension can also be used to configure the extension in setup.  This is done through additional environment variables in the .env which are:

| Environment Variable | Description |
| ---------------------|-------------|
| EXPERIENCE_EXTENSION_SHARED_SECRET | A string with a minimum of 32 characters
| EXPERIENCE_EXTENSION_ENABLED | a javascript boolean (true/false)
| EXPERIENCE_EXTENSION_ENVIRONMENTS | a case-sensitive, comma-delimited list without spaces (Tenant1,Tenant2)
| EXPERIENCE_EXTENSION_RETURN_API_TOKEN | a javascript boolean (true/false) that returns an api token to the console on upload. EXPERIENCE_EXTENSION_SHARED_SECRET must be set for this to return the token.

You can define any combination of these, none are required.  These features correspond to the same toggles present in the Setup Application's UI.

## Package Scripts
Below is a short description of the scripts found in package.json.

| Script | Description |
|--------|-------------|
| build-dev | Package the development build. |
| build-prod | Package the production build. |
| deploy-dev | Package and deploy the development build. |
| deploy-prod | Package and deploy the production build. |
| watch-and-upload | Package and deploy the development build while also watching for changes to automatically deploy updated builds. |
| start | Package the development build and run a websocket server where changes are served directly from your development machine. No reload necessary. |
| lint | Run eslint to check code against linting rules. |

## Sample cards
Creating an experience extension will also create a sample card, with a page to help demonstrate how props and hooks can be used in the Ellucian Experience Software Development Kit (SDK). For more of our sample cards and examples of how to unit test cards, visit: https://github.com/ellucian-developer/experience-extension-sdk-samples

## Code checking
The project is also set up to check for coding errors and best practices. By running eslint (npm run lint), the code will be statically analyzed to find problems based on the rules established in .eslinitrc.json.

## Resetting Your npm Environment

If want to start fresh, with a clean npm environment — for example, after upgrading to a new version of the SDK — follow the steps below.

First, clean your npm cache:

```
npm cache clean --force
```

Reinstall all your dependencies from scratch:

1. Delete your node_modules directory
2. Delete your package-lock.json file
3. Run `npm install`