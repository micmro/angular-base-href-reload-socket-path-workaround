# Demo to fix sockjs-node path serving with base-href
## Demo Project setup steps

```
ng new base-href-socket-path --style=css --inlineStyle=true --inlineTemplate=true --routing=false --minimal=true
```

## Starting the server
```
ng serve --baseHref="/my-app/" --publicHost="http://localhost:4200/my-app"
```
With `baseHref`, to serve files from `my-app`, and `publicHost` to ensure [`webpack-dev-server`'s](https://github.com/webpack/webpack-dev-server) reloading socket requests `my-app/sockjs-node` not `sockjs-node`.

This can be useful when combining a few projects via a proxy to get them using the same hostname (e.g. to shared cookies).

## Issue
The auto-reload `sockjs-node/*` websocket requests fails with a 404:

E.g. `curl http://localhost:4200/my-app/sockjs-node/info` returns:
```html
> GET /my-app/sockjs-node/info HTTP/1.1
> Host: localhost:4200
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Security-Policy: default-src 'none'
< X-Content-Type-Options: nosniff
< Content-Type: text/html; charset=utf-8
< Content-Length: 162
< Date: Sat, 19 Oct 2019 13:43:22 GMT
< Connection: keep-alive
<
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /my-app/sockjs-node/info</pre>
</body>
</html>
```

## Workaround

The problem is caused by the webpack dev-servers [`sockPath`](https://webpack.js.org/configuration/dev-server/#devserversockpath) not getting set correctly.

Using a [`@angular-builders/custom-webpack`](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack#Custom-webpack-dev-server):
- `npm install @angular-builders/custom-webpack --save-dev` or `yarn add @angular-builders/custom-webpack --dev`
- update `angular.json` as described [here](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack#example)
- add a `./extra-webpack.config.js` file with
```javascript
module.exports = (config, options) => {
  if(!config.devServer) {
    // do nothing for `ng build`
    return config;
  }
  return {
    ...config,
    devServer: {
      ...config.devServer,
      sockPath: `${config.devServer.publicPath}/sockjs-node`
    }
  };
};
```