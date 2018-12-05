[![License: AGPLv3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/zimmerman-zimmerman/RAADS-INFORMATIE-PORTAAL-RIS/blob/master/LICENSE.MD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/456beda376f04d5e82c245c510e8f653)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zimmerman-zimmerman/Raads-informatie-Portaal-RIS&amp;utm_campaign=Badge_Grade)

# Raads Informatie Portaal (RIS)
--------

NL | Het Raads informatie Portaal (RIS) levert open-source software voor Nederlandse Gemeente om alle besluiten die door de raad worden genomen te volgen. Nederlandse griffies kunnen gebruik maken van de de online agenda om vergaderingen te organiseren. Burgers kunnen alle besluiten en agende punten volgen en inloggen om zo hun eigen dossier aan te maken en te volgen. Raadsdocumenten kunnen worden ontsloten en via de zoekmachine zijn deze voor iederen vindbaar en inzichtelijk. RIS is een iniatief van de Gemeente Almere.

UK | The local council information Portal (RIS) is open-source software that can be used by Dutch municipalities to track decisions made by the council. Registrars to the dutch municipalities ('griffie') are able to setup agenda's for the council. Civil society is able to track all information published by the municipality and is able to create Dossiers to track specific subjects handled by the municipality. All files published by the municipality are indexed and made available using a search engine. RIS is an iniative by the municipality of Almere.

## About the project
--------
* Authors:          <a href="https://www.zimmermanzimmerman.nl/" target="_blank">Zimmerman & Zimmerman</a>
* Municipalities:          <a href="https://gemeenteraad.almere.nl/" target="_blank">Municipality of Almere</a> and  <a href="https://www.utrecht.nl/bestuur-en-organisatie/gemeenteraad/" target="_blank">Municipality of Utrecht</a> 
* License:          AGPLv3 (see included <a href="https://github.com/zimmerman-zimmerman/Raads-Informatie-Portaal-RIS/blob/master/LICENSE.MD" target="_blank">LICENSE</a> file for full license)
* Github Repo:      <a href="https://github.com/zimmerman-zimmerman/Raads-Informatie-Portaal-RIS/" target="_blank">github.com/zimmerman-zimmerman/Raads-Informatie-Portaal-RIS/</a>
* Bug Tracker:      <a href="https://github.com/zimmerman-zimmerman/OIPA/issues" target="_blank">github.com/zimmerman-zimmerman/Raads-Informatie-Portaal-RIS/issues</a>



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
