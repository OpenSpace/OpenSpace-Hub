# openspace-hub
server for hub.openspaceproject.com

To-Do:


- [x] set up the project using Express, and MongoDB.
- [x] CRUD APIs for hub items and authentication
- [x] JWT token integration
- [x] Swagger Integration
- [x] HubItems Schema Creation
- [x] Users Schema Creation
- [ ] Paging of GetItems
- [ ] filtering of GetItems
- [ ] Updating of HubItem
- [x] Delete HubItem
- [x] File Uploads
- [x] Testing APIs with existing application
- [ ] Front end webpage
  - [x] Home Page (having all itemtypes)
  - [ ] Divide the items by type
  - [x] Login and Signup Page
  - [x] Google Auth Integration
  - [x] Logout functionality
  - [ ] Search Functionality
  - [x] Integrate OpenSpace API
  - [x] Import Profile, Asset, Recording module
  - [ ] Linkedin Auth Integration
  - [x] Facebook Auth Integration
  - [ ] Github Auth Integration
  - [x] Upload page Frontend
  - [x] Upload page Backend
  - [ ] Social Media Logout
  - [ ] Forgot Password
- [x] Add Item Types - Profile
- [x] Add Item Types - Recording
- [x] Add Item Types - Web Panel (WWW)
- [x] Add Item Types - Video
- [x] Add Item Types - Config
- [ ] User page
- [ ] Profile Dependencies
- [ ] Jenkinsfile
- [x] Dockerfile and docker-compose file
- [ ] Secure port
- [x] Default Item Image 

Steps to run the project:
1. create a .env file inside frontend folder and add below content:
```
REACT_APP_GOOGLE_CLIENT_ID="<google-client-id>"
REACT_APP_FACEBOOK_APP_ID="<facebook-client-id>"
```
2. CD to the project OpenSpace-Hub folder 
3. build docker-compose.yaml file
```
docker-compose build
```
4. run docker-compose
```
docker-compose up
```
