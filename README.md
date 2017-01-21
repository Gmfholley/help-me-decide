#Set Up for Fun Site

To run this locally, you need node, npm, and mongdb.  

1. [Install Node](https://nodejs.org/en/download/) and npm comes bundled with it.

2. [Install mongodb.](https://docs.mongodb.com/manual/installation/)


3. While you're in the root of this repo, install all of my dependencies, using npm.  They are listed in package.json and can be installed with the command below.

```
	$ npm install
```
4. Open `config.json` and change the `connectionString` to the database and add your own secret string for the server.  Then remove the `config.json` from your repo so others can't guess your secret.


5. Look up how to run a mongo server in your environment.  In a Mac environment, try running this in a new terminal windo:
```
	$ ./mongod
```

6. Open a new terminal to query your mongo database.  You may need to do this as a super user.  In a Mac environment, try:

```
	$ ./mongo name-of-database
```

Some nice queries to test are:

```
	$ show collections

//   lists collection names


	$ db.<collection-name>.find()

// returns default number of records

```


7. Run this app in your environment with `npm start`.

