# Recipes

## Using Minio on a Docker Compose Stack

## Adding authentication to the GraphQL schema using Hasura Actions

## Adding Google Auth

This does uses Googles Web Applications using the OAuth 2.0 API. Google has other auth settings for iOS and Android and of course API key, however these are not supported here.

Local host used in local development is used in this example.

HBP needs the following env variables to work properly.

GOOGLE_ENABLE: 'true'
 
 GOOGLE_CLIENT_ID: YOURGOOGLECLIENTID.apps.googleusercontent.com
 
 GOOGLE_CLIENT_SECRET: YOURGOOGLECLIENTSECRET
 
 REDIRECT_URL_SUCCESS: http://localhost:3000/auth/login
 
 REDIRECT_URL_AILURE: http://localhost:3000/auth/dang

 Settings in a google account are needed as well. You will need a project in

https://console.developers.google.com/apis/credentials

To create creds for the OAuth.

Click Create Credentials Create creds for a OAuth client ID Choose Web Application

You can then get your Client ID and Client Secret.

And add to google account in "Authorized redirect URIs":

http://localhost:3000/auth/providers/google/callback

User sign in url, a get call to:

http://localhost:3000/auth/providers/google

Re directs to google sign in url with url params indicating youor google account settings:

https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount

This will prompt user to choose google account and login to google.

Upon choosing/login success the user is sent back to the http://localhost:3000 success url.

The browser will now have a cookie for from your domain with a refresh token. This can be exchanheaged for a jwt
