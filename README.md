[![License: AGPLv3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/zimmerman-zimmerman/ris-frontend/blob/master/LICENSE.MD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dfce976c42cb4f449df3c668071d41d6)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zimmerman-zimmerman/ris-frontend&amp;utm_campaign=Badge_Grade)

# RAADS-INFORMATIE-PORTAAL-RIS


## Install dependencies
--------

From the root folder:

`npm install` or `yarn install`


## Configuration
--------

Change municipality

 In `src/config.js` there is a variable called `muni`
 
 Adjust the variable's value with one of these options `Almere | Utrecht | Rotterdam`
  
 In `src/styles/variables.scss` there is a variable called `$municipality`
 
 Adjust the variable's value with one of these options `Almere | Utrecht | Rotterdam`


## Run
--------

For development:

`npm start` or `yarn start`

App should be running on <http://localhost:3000/>


## Build
--------

For production build:

`npm run build` or `yarn build`

Build files should be in `build`


## Running the tests
--------
To run the tests you need to edit the cypress.json file in the repo's root directory.

Adjust the following variables:

- `baseUrl` - the url where the project runs at
- `username` - admin username
- `password` - admin password
- `backendUrl` - the back-end url the project is using
- `searchKeyword` - a keyword to test search functionality with
- `deleteUsername` - validated test user's username
- `deletePassword` - validated test user's password
- `deleteUsername2` - new test username (for editing)
- `deletePassword2` - new test password (for editing)

Then run `npm cypress:open` or `yarn cypress:open`
