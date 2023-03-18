# E-live Library Extension Demo

This solution uses .NET 7 framework, with a React front end, and Postgres for storage.

## Requirements

### Docker

Only required if using the same database

* `Docker Desktop` ([Download](https://www.docker.com/products/docker-desktop/))
* `Postgres Image` ([Download](https://hub.docker.com/_/postgres/))
* `BeaverDB Image` ([Download](https://hub.docker.com/r/dbeaver/cloudbeaver))

### ServerSide

* `Visual Studio` (2019+)
* `.NET 7 SDk` ([Download](https://dotnet.microsoft.com/en-us/download/dotnet/7.0))

### ClientSide (Extension)

* `Node 16.15.0`

## Usage

### Docker Folder

Ensure you have the images listed under the [Requirements](#docker) section.

You can run the stack.yml file by the following command:

```bash
docker-compose -f stack.yml up
```

Verify through either the Docker CLI or UI that a stack, with the postgres and dbbeaver images running.

### ServerSide Folder

Ensure you have the necessary SDK and application installed under the [Requirements](#serverside) section.

Open the .sln located in this folder.

Here, you have two options:

* You can deploy this project to a server with a dedicated application pool and site in IIS.
* You can run this project locally, and rely on IIS Express for testing purposes.
  * The default port for this is 5131
  * Example: http://localhost:5131

Take note of all of the environment variables located in appsettings.development.json. You should update these variables for your institution.
This is not shipped with a production build.

Vising the base route will always redirect to `EXPERIENCE_HOME`.

The project has been setup so that the /api route can only be accessed with a Experience jwt.
If you're testing endpoints locally, you'll need to remove (comment) this part of the app in program.cs

```C#
app.UseWhen(
    ctx => ctx.Request.Path.StartsWithSegments("/api"),
    appBuilder => Validation.ExperienceHandler(appBuilder)
);
```

### Extension

This follows the same cadance as an extension created by the create-experience-extension command with some added linting (react hooks, jest) and additional testing utils.

#### Testing

Testing examples are included, on how to write unit tests for native fetch, react context hooks, and memoized functions.

Unit test coverage:

```bash
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   99.15 |    97.91 |   96.55 |     100 |
 cards              |     100 |      100 |     100 |     100 |
  ExtensionCard.jsx |     100 |      100 |     100 |     100 |
 common/api         |     100 |      100 |     100 |     100 |
  fetchs.js         |     100 |      100 |     100 |     100 |
 common/components  |     100 |      100 |     100 |     100 |
  CardDisplays.jsx  |     100 |      100 |     100 |     100 |
  Search.jsx        |     100 |      100 |     100 |     100 |
  Table.jsx         |     100 |      100 |     100 |     100 |
 common/utils       |     100 |      100 |     100 |     100 |
  useStyles.js      |     100 |      100 |     100 |     100 |
 page               |   98.23 |    95.45 |   92.59 |     100 |
  Home.jsx          |   98.18 |    95.45 |    92.3 |     100 | 136
  router.jsx        |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------
Test Suites: 7 passed, 7 total
Tests:       47 passed, 47 total
```
