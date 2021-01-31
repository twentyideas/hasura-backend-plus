# Recipes

## Adding Google Auth

This does uses [https://developers.google.com/identity/protocols/oauth2/web-server](Googles Web Applications using OAuth 2.0) API. Google has other auth settings for iOS and Android and of course API key, however these are not supported here.

Local host is used in this example.

HBP needs the following variables in docker-compose.yanl to work properly.

```yaml
    GOOGLE_ENABLE: 'true'
    GOOGLE_CLIENT_ID: YOURGOOGLECLIENTID.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET: YOURGOOGLECLIENTSECRET
    REDIRECT_URL_SUCCESS: http://localhost:3000/auth/login
    REDIRECT_URL_FAILURE: http://localhost:3000/auth/dang
 ```

 This enables the /auth/providers/google route and stores variables.

Settings in a google account are needed as well. You will need a project in:

https://console.developers.google.com/apis/credentials

To create creds for the OAuth.

Click on Create Credentials ->  OAuth client ID -> Web Application

You can then get your Client ID and Client Secret.

And add to google account in "Authorized redirect URIs":

http://localhost:3000/auth/providers/google/callback

User sign in url, a get call to:

http://localhost:3000/auth/providers/google

Redirects to google sign in url:

https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount

with url params indicating your google account info.

This will prompt user to choose google account and login to google.

<<<<<<< HEAD
Upon choosing an account and login success the user is sent back to the http://localhost:3000/auth/login redirect url you added to the google account adn in the docker-compose. These MUST match in the google account and in your docker-compose **exactly** or you will see an error.

The browser will now have a cookie from your domain with a refresh token. This dotken is also in the url string as a param. This can be exchanheaged for a jwt.

## Native Mobile

There maybe a need to use HBP for a native mobile application. This oauth flow can still be used, however you wil need to open a browser and set up a page with redirect (js redirect not 3xx redirects) to a deep link back to your native application passing the token in the link. The refresh token can then be exchanged for a jwt via a GET call and stored on the native device. 


## Using Minio on a Docker Compose Stack

## Adding authentication to the GraphQL schema using Hasura Actions