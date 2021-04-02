## How to run
## Database
### Intel
```
$ docker pull mariadb/server:10.3
$ docker run -p 127.0.0.1:3306:3306 -d --name maria -eMARIADB_ROOT_PASSWORD=root -eMARIADB_DATABASE=test mariadb/server:10.3
```
### Apple Silicon
```
$ docker-compose up -d
```
## Server
```
$ cd server
$ yarn && yarn start
```
## Client
```
$ cd client
$ yarn && yarn start
```
