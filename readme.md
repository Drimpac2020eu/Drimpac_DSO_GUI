# DSO GUI Drimpac
Drimpac H2020 Project

## Configuration

### Change API IP
To deploy the application, the API IP must be changed to reflect the server's IP


Change the IP of the variable `window.__env.httpsServer` inside:
```
  drimpac/src/env.js 
```

## Web Interface
There are several ways to access the Web Interface:

- http://\<API-IP\>:21570/
- http://localhost:21570/ (when using the deployment server to access it)
