## Fire Alerts

This project encompasses a web interface for admins of the fire alerts groups, and backend functions that support it.
The [UI](ui) and [Cloud Functions](functions) live in separate directories as separate npm projects.

#### Building
The UI project will need to be built before deployment.
```
cd ui
npm run build
```

#### Deployment

Before deploying for the first time you must make a copy of `functions/set-config.sh`.
If you name it `functions/set-config-local.sh`, it will be ignored by git. Update
the twilio credentials in your local copy and then run the script.


For deployment, run the following from this parent directory:
```
firebase deploy
```
