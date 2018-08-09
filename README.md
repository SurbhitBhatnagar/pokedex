Pokedex is a device which acts as the official encyclopedia of the Pokemon universe. In the Pokemon series, the fictional characters like Ash used to use the device to find the details about a new found Pokemon.
This is a web application which has tried to imitate the same Pokedex. It searches and informs the user, the details related to the Pokemon they want to explore.
The user can search based on “Name”, “ID” (limiting to 151) and “type”. For instance, the user can type “Pikachu” in the search bar and click the search button. It will result in a UI component which if clicked will give details about Pikachu.

/**********************************************************************************************************/

Getting Started
To run the application, we need to first install the dependencies.
->	Install Node.js environment and npm:-
The web application is run through the Node.js Console, and requires node package manager (npm) to install the web app dependencies and run the application.
Here is an article on installing both:-
Windows OS:
http://blog.teamtreehouse.com/install-node-js-npm-windows
Mac OS:
https://treehouse.github.io/installation-guides/mac/node-mac.html

/***********************************************************************************************************/

Prerequisites and app running instructions
->	npm install:
After the setting up of Node environment:-
•	Open the Node.js Command prompt/ terminal and go to the project directory.
•	Then in the project folder directory, type “npm install”
“npm install” will automatically read the dependencies in the “package.json” file and install.

->	Run the Application:
After the installation is complete. The web application is ready to be run in a web browser.
To run the application, type “npm run dev” in the same project directory in Node.js Command Prompt.

Through “BrowserSync” a web browser should automatically open and run the application.
The application runs on http://localhost:3000/ .

/************************************************************************************************************/
To test the application try the following:-
-> Enter "bulbasaur"/"PIKACHU"/"piKAchU" and click search button
-> Enter a number between 1 to 151 for an expected Pokemon to be displayed.
-> Enter a number greater than 151, for example 189, it should throw an error message.
-> Enter a type, for example "Fire".
----> A list of Pokemons will appear and after clicking on their names in the UI their details will appear.
/***********************************************************************************************************/
The Main Code is in the app.js program in Angular directory.
