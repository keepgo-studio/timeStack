# Project name : Time Stack 

## Stacks

Electron js + tailwindcss

## architecture

* front-end side : tasks for only UI things

* back-end side : handle and mange for local cache and taking operating things

* communication : font-end and back-end side communicate each other by one module named "messenger.js"




## etc

* after the project is launched, will be rewritten for three optimizations.

    1. clean code 
    
        meaning that code or names are should be legible and concise

    2. clean architecture / refactoring
    
        efficient structure is needed if the project is messy

    3. 


## issues I got

1. npm install sqlite3
    
    since npm told me that there are 3 secure vulnerabilities I checked by running 'npm audit', and get message below.

```
3 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
```

I've found out that vscode teams had published node-sqlite for their project

This works find for me , [issue link]('https://github.com/mapbox/node-sqlite3/issues/1493#issuecomment-980521241')