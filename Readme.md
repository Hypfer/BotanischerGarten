# BotanischerGarten
###### A modular Telegram bot 
___

__BotanischerGarten__ is a modular, open-source telegram bot based on:
* Node.js
* Typescript
* MongoDB
* Various Patterns

## Requirements
* MongoDB >= 3.2
* Node.js >= 6.0.0


## Getting started
* Create a New Bot at `@BotFather` with `/newbot`
* Enable Inline at `@BotFather` with `/setinline`
* Install the typescript compiler with `npm install -g typescript`
* Copy the `config.example.json` to `config.json`, change the token and check the database connection string
* Navigate into the root folder of this project
    * `npm install`
    * `tsc -p .`
* Run the Bot: `node app.js`
* Add the Bot to the relevant groups
* For now you'll have to manually grant usage/admin rights by editing the Database.
[Robomongo](https://robomongo.org/) is the recommended tool for this task.
    * Everytime the Bot sees a message from a new user it saves him in the `Users` collection.
    * To give this user permission to use this bot add the string "user" to its `roles` array.
    * To promote this user to admin add "admin" as well.

## Q: What does it do?
A: Depends on the module

### Hashes
The main module is the `Hashes` module, which provides a Key:Value Storage for Telegram Messages.
Just reply to a Message in a group with `#define xy` and whenever you or any other user of your bot sends a message containing `#xy` the bot will reply with the previously defined content.

These hashes are also available via inline: `@Botname`.  
You can search for hashes or enjoy endless scrolling with random hashes by not entering a search term.

### Other Modules
Yes, there are other modules as well. Go try them. They're also available via inline and have special hashes.

## FAQ
* Can I contribute?
    - Yes.
* How?
    - Fork, PR, Done.
* Why the name?
    - Yes.