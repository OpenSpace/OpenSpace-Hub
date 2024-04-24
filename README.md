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
- [ ] Updating of HubItem - [License can't be changed]
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
- [x] disable simple signup
- [ ] delete user profile
- [ ] download counts
- [ ] sort by
- [ ] slack button
- [ ] package 
- [ ] no exe inside the zip
- [ ] sanitizing user/search input
- [ ] Warning text: you are responsible for whatever is in it - On Upload page, Item can be modified by administrator if required, accept terms and con
- [ ] adminstrator table - uploading false, signup false (In case of fire, site can remain active and nothing)
- [ ] Tags
- [ ] Which version (dropdown) it works with - ask user in the upload page
- [ ] Openspace team can edit 
- [ ] License dropdown
- [ ] checkbox for 13 years old


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
