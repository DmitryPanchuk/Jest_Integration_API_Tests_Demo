# Jest API Integration Tests
This is a demo of project structure used by me, there is no actual API covered by the spec of the demo

## Framework
jest - as test core, axios and needle - as request makers, allure - as reporter

## Installation
### Dependencies
`npm i`
### Allure
https://docs.qameta.io/allure/#_installing_a_commandline

## Project structure
Jest-Integration-API-Tests/  
├── allure-report/ ─ stores allure report generation app files  
├── allure-results/ ─ stores allure .xml reports  
├── config/ ─ stores config file which exports api paths and db/user creds  
├── data/ ─ stores test data  
├── helpers/ ─ stores useful helper functions  
├── lib/ ─ stores abstract methods for http requests/queries  
├── methods/ ─ stores api http methods  
├── test/ ─ stores jest test spec files  
├── package.json ─ stores jest and global app configuration properties  
├── setup.js ─ global jest initialization script which runs before all tests (includes auth, environment settings retrieval)  
├── teardown.js ─ global jest tear down script which runs after all tests (includes log out process)  
└── babel.config.js ─ stores babel config needed for joi module integration  

## Running tests
To run all tests on 192.178.10.101 evn use:

`npm run allTests --jest-integration-api-tests:envHost=192.178.10.101`

To run specific test or test suite using regex pattern on 192.178.10.101:

`npm run testPattern "making tea" --jest-integration-api-tests:envHost=192.178.10.101`

To run specific test file:
`npm run test /Users/yourUser/Projects/Jest-Integration-API-Tests/test/makeTea/makeTea.spec.js --jest-integration-api-tests:envHost=192.178.10.101`

To run tests with specific user credentials use:
`npm run allTests --jest-integration-api-tests:envHost=192.178.10.101 --jest-integration-api-tests:neUser=customUser --jest-integration-api-tests:Domain=customDomain --jest-integration-api-tests:customUserPassword=12345 --jest-integration-api-tests:UserAccountType=1 --jest-integration-api-tests:settingsPort=9999`

## npm config params
* envHost - linux host ip address
* envWindowsHost - windows host ip address (automatically assigned during global setup)
* User - user
* Domain - domain
* UserPassword - password
* AccountType - user auth method
* settingsPort - port for settings book service
* settingsBook - data from /settings method needed for framework configuration

Note, that if you omit --jest-integration-api-tests:customUser and --jest-integration-api-tests:envHost params (or any other), 
they would be set to defaults in the package.json config corresponding properties

## Allure
### Generating Report
By default reports are generated into allure-results directory, reporter web app is generated into allure-report

To generate report use:
`allure generate`
or
`allure generate --clean`

To open report use:
`allure open`

### Allure Run History
To see correctly run history you have to copy /history dir from allure-report dir to allure-results:
```
cp path/to/allure-reports/history path/to/allure_results/history
allure generate path/to/allure_results/ -o path/to/allure-reports/ --clean
allure open path/to/allure-reports/
```

### Waiting for async operations
To be able to wait for promises in evaluate window of WebStorm debug you should use global function deasyncPromise

For non 400-500 axios responses 
```
      deasyncPromise(
        API.cook.tea.drinkTea()
      );
```

For 400-500 axios responses 
```
      try {
        deasyncPromise(
            API.cook.tea.drinkTea()
        );
      } catch (err) {
        err
      }
```

## Framework setup and teardown
Before the initiation of test run framework setup starts in setup.js file. During setup framework makes authentication and gathers environment data by sending request to /settings

Upon the completion of test run the teardown process occurs in teardown.js file. During teardown framework accomplishes log out process

## Global object properties 
### Assignment
Before the start of test run happens the process of global property assignment. This process is configured through jest config property setupFilesAfterEnv

Jest config is stored as a property in package.json -> jest 

The setupFilesAfterEnv property declares the list of files which will be run before any spec. Inside those files you would typically see the assigment of values or functions to global object
