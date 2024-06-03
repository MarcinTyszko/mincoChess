# Environment Variables

Environment variables for this application are stored in a file called `.env` that should be located in the root directory of the project. If you have just cloned the repository, you will need to create and populate this yourself.

This documentation page describes the variables that you can specify in this file.

## `NODE_ENV`
The environment that the application is running in.

Can either be `dev` or `prod`.

In development mode:
- the bundle file emitted by Webpack is more verbose and contains comments to clarify separation between resolved modules.
- React will log more errors to the console.

Do **not** use development mode when deploying the application.

## `PORT`
The port on which the backend web server listens on; defaults to `8080`.