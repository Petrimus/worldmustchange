# World Must Change

Application which allows user to see statistcs about carbon dioxide emissions and population in the world. Application consists of two parts, frontend and backend.

## Backend
Backend is web server written with Node js. It will collect data from World Bank data api in csv-format and transforms it to json-format. final Data is comprised of yearly values of individual country's population and carbon dioxide emissions from 1960.  It will serve frontend as static site and also provide above data to the frontend. Although the frontend could gather the same information by itself, I wanted the data to be collected by server for training purposes and it can provide same data to other application if needed. There will be also some test to test if data is correct and authentication management, which will propably use MongoDb.

## Frontend 
Frontend is React application which uses data provided by the backend. There are 265 countries and summaries and application let user to see summaries, choose a country to examine, compare countries etc. It will draw some graphs and present some tables. It will also require authentication.
