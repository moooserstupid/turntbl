# Music Collection API And Web App

This project was developed as part of an assignment in Marmara University's **BLM3062.1.0 Açık Kaynak Kodlu Yazılımlar** (Open Source Software) class. The server handles:
+ adding tracks
+ modifying tracks by id
+ deleting tracks by id 
+ listing all tracks together and by id 

The project has been implemented as a collection of networking docker containers using docker compose. Here is a list of the containers and the services they provide:
1. `music-web-app`: Runs the server code and interfaces with the database to retrieve and store information.
2. `music-postgres`: Runs an instance of postgres. 
3. `swagger-ui`: Provides a convenient UI for viewing the API endpoints and testing them. 

The **REST API** has been documented in **OpenAPI** format and the `openapi.yaml`  file is included in the doc folder.


## Setup And Use

Docker and docker compose installed and set up into your system in order to work with this project. Then you need to fork the repository and cd into it. 

This command builds the docker image, runs it and starts all the services:

```bash
foo@bar:~$ docker compose up --build
```
This command terminates all services and the network:
```bash
foo@bar:~$ docker compose down
```

To visualize the API and test it you can use **SwaggerUI** which is included as a docker container and can be accessed from the following address:
>http://localhost:81

The server itself can be interfaced with directly by directing your browser to:
>http://localhost:3000


 
##  Ports

The ports that the containers are left open to access from are given below.

|container_name  |host                           |container                    |
|----------------|-------------------------------|-----------------------------|
|music-web-app	 |3000							             |3000						             |
|music-postgres  |8001							             |5432						             |
|swagger-ui	     |81														 |8080												 |



