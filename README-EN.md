# 🐕‍🦺 Petlove

Project 1 for the class of Database I, based on the [Petlove backend challenge](https://github.com/petlove/vagas/tree/master/backend-ruby), developed by [Beatriz Maia](https://github.com/beamaia) and [Sophie Dilhon](https://github.com/AHalic).

## 📜 Problem 
### Scenario: You need to project an application for managing animals.
- People have animals and animals have type.
- A person has the following attributes: name, ID (CPF), date of birth, address with number, street, city and postal code, and phone number.
- An animal has the following attributes: name, owner, species (animal type), date of birth, unique ID.
- A type of animal has the following attribute: name and unique ID
- A service has the following attributes: name and unique ID.
- A schedule has the following attributes: animal, owner, type of service and unique ID.

### Rules
- A person could have multiple animals.
- Animals can only have one owner.
- CPFs are unique identifiers.
- A time slot can only be occupied once.
- A service and an animal type name must follow the regex '[A-Z] + [a-z ]*'.
- Dates must be as YYYY-MM-DDD, and in case it is a schedule, it must also have the time slot H:M.

## ⚙️ Configuring environment

In order to run this project, you need docker-engine version 20.10.17 and docker-compose version 3.8 at least. You also need a .env file with the following variables:
```sh
DB_NAME
DB_PASS
DB_USER
```

Currently, the entrypoint at the dockerfile is init.sh, that runs the code for filling up the postgres database and the npm test script. To run the project, you must use the command:
```sh
docker-compose up
```

It's important that you run this command inside the project's repository.

## 📊 Conceptual model

The problem was conceptualized with 3 entities that have relationship with eachother. The image down below represents the initial concept.

![Conceptual model](docs/conceptual_mode.png)

With that, 5 tables were created: Person, Animal, Schedule, AnimalType and ServiceType.

![Table models](docs/model.png)

# 🫶 Special thanks
To get started with the docker image, we used [docker-compose-postgres-template](https://github.com/alexeagleson/docker-node-postgres-template) by [alexeagleson](https://github.com/alexeagleson). The repository was very helpful in order to understand more about Docker and Docker-compose. 
