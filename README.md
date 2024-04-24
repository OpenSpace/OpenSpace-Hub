Openspace-Hub
=============
server for hub.openspaceproject.com

To-Do:


- [x] set up the project using Express, and MongoDB.
- [x] CRUD APIs for hub items and authentication
- [x] JWT token integration
- [x] Swagger Integration
- [x] HubItems Schema Creation
- [x] Users Schema Creation
- [x] Paging of GetItems
- [x] filtering of GetItems
- [ ] Updating of HubItem
- [x] Delete HubItem
- [x] File Uploads
- [x] Testing APIs with existing application
- [ ] Front end webpage
  - [x] Home Page (having all itemtypes)
  - [x] Divide the items by type
  - [x] Login and Signup Page
  - [x] Google Auth Integration
  - [x] Logout functionality
  - [x] Integrate OpenSpace API
  - [x] Import Profile, Asset, Recording module
  - [x] Facebook Auth Integration
  - [ ] Linkedin Auth Integration
  - [ ] Github Auth Integration
  - [ ] Social Media Logout
  - [ ] Forgot Password
  - [x] Search Functionality
  - [x] Upload page Frontend
  - [x] Upload page Backend
- [x] Add Item Types - Profile
- [x] Add Item Types - Recording
- [x] Add Item Types - Web Panel (WWW)
- [x] Add Item Types - Video
- [x] Add Item Types - Config
- [x] User page
- [ ] Profile Dependencies
- [ ] Jenkinsfile
- [ ] Secure port
- [x] Dockerfile and docker-compose file
- [x] Default Item Image 


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
