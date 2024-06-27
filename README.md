Openspace-Hub
=============

Note: To-Dos are moved to [TODO.md](TODO.md) file

server for hub.openspaceproject.com


Local deployment
====================================

To deploy the system locally using docker-compose, follow those step:

Set up environment
------------------
Copy env.default to .env inside frontend folder and update the variables there. 
```
cd frontend
cp .env.default .env
```

Build the containers
--------------------
Navigate to the root directory of the repository (OpenSpace-Hub folder) and build docker-compose.yaml file.
```
cd ../
docker-compose build
```

Start the base containers
-------------------------
```
docker-compose up
``` 

Note:
If you are running on a non-standard architecture (such as ARM), then you need to use bcryptjs instead of bcrypt.