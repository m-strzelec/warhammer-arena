# Warhammer Arena

## Description

**Warhammer Arena** is an application developed to support tabletop RPG gameplay for the **second edition of Warhammer Fantasy Roleplay**. It enables centralized management of player characters and in-game resources such as equipment and skills, and also provides a simulator for handling combat between characters.

### Key Features

- Centralized management of:
  - Player characters
  - Equipment
  - Skills, talents and traits
- Combat simulation engine

### Target Audience

The main target users of this system are players of **Warhammer Fantasy Roleplay 2nd Edition** and fans of traditional tabletop role-playing games. 

The system can be used as:
- A tool for storing detailed character data
- A companion for game masters and players during sessions
- A utility for automating minor combat encounters with its built-in simulator

## Technologies Used

### Frontend: 
* React.js,
* React Bootstrap,
* PrimeReact,
* Axios,
* nginx
### Backend:
* Node.js
* Express.js,
* mongoose (MongoDB),
* pg (PostgreSQL),
* amqplib (rabbitMQ)

## API Documentation

A detailed description of each route, including required parameters, example requests and responses, as well as data schemas, is provided via the configured **Swagger UI** tool.

Swagger UI offers **interactive documentation** that also allows testing the endpoints directly from the browser.

Once the application is running, Swagger is available at the API Gateway server under the path **/api-docs**.



## Running the Application

The recommended method for running the application is by using **Docker**, which provides a consistent environment regardless of the host operating system.
You need to also configure the **environment variables** used by Docker Compose. An example configuration might look like this:

```env
MONGO_PORT=27017  
MONGO_DB=mongodb  
MONGO_USER=mongouser  
MONGO_PASSWORD=mongopassword  
MONGO_HOSTNAME_PROD=mongo  
MONGO_HOSTNAME_DEV=localhost  

POSTGRES_PORT=5432  
POSTGRES_DB=postgresdb  
POSTGRES_USER=postgresuser  
POSTGRES_PASSWORD=postgrespassword  
POSTGRES_HOSTNAME_PROD=postgres  
POSTGRES_HOSTNAME_DEV=localhost  

AUTH_SERVICE_PORT=5000  
TRAIT_SERVICE_PORT=5001  
ARMOR_SERVICE_PORT=5002  
WEAPON_SERVICE_PORT=5003  
TALENT_SERVICE_PORT=5004  
SKILL_SERVICE_PORT=5005  
CHARACTER_SERVICE_PORT=5006  
FIGHT_SERVICE_PORT=5007  

GATEWAY_PORT=8080  
FRONTEND_PORT=3000  

JWT_SECRET=access_token_key  
JWT_REFRESH_SECRET=refresh_token_key  

RABBITMQ_USER=rabbitmquser  
RABBITMQ_PASSWORD=rabbitmqpassword  
```

After setting up the environment variables, run the following command from the root directory of the project to build the Docker images and start all defined services:
```bash
docker-compose up --build -d
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
