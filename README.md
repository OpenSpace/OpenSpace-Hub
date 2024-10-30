Openspace-Hub
=============

Welcome to the OpenSpace Hub. Here you will find items (assets, profiles, recordings, webpanels, configs, packages) built by the community. Download them or use the Import button when OpenSpace is running to have OpenSpace download them for you.


Setup Instructions
------------------

To deploy the system locally using docker-compose, follow those step:

Set up environment
------------------
Copy env.default to .env inside frontend folder and update the variables there. 
```
cd frontend
cp .env.default .env
```

The Database
------------------
To reset the database or to load the sample hubitems, configs, users collections, run `num run seed`

Upload folder and Firebase service account
--------------------
create the folders `OpenSpace-Hub/uploads/firebase-admin`
Go to `Firebase -> Project Settings -> Service Accounts -> Generate new private key`. It will download a .json file. Rename the file to `authentication-4b8de-firebase-adminsdk.json`. Save this file to the location `OpenSpace-Hub/uploads/firebase-admin`

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


Access the server on http://localhost:9000/


![Dashboard](public/defaults/images/dashboard.png)
![UploadItem](public/defaults/images/uploadItem.png)

Old Server: [https://hub.openspaceproject.com](https://hub.openspaceproject.com/)

Privacy URL: [http://files.openspace.amnh.org/static/web/privacy.html] (http://files.openspace.amnh.org/static/web/privacy.html)

T&C URL: [http://files.openspace.amnh.org/static/web/terms.html] (http://files.openspace.amnh.org/static/web/terms.html)