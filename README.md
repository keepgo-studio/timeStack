# Project name : Time Stack 

## Stacks

Electron js + tailwindcss

## architecture

* front-end side : tasks for only UI things

* back-end side : handle and mange for local cache and taking operating things

* communication : font-end and back-end side communicate each other by one module named "messenger.js"


## goals

### main goal : produced and deploy to internet

### initial goal : make demo1 that works perfectly as I planned it before

## etc

* after the project is launched, will be rewritten for three optimizations.

    1. clean code 
    
        meaning that code or names are should be legible and concise

        I guess,
        
            it is much better to choose unit for each value. For timeStack, set 'minute' as unit for time since when I was going to handle time data by saving hour and minute seperately, makes me confuse sometimes.

    2. clean architecture / refactoring
    
        efficient structure is needed if the project is messy

    3. documentation

        since I've got no documents for technology and for business

    4. choose profit stacks

        profit stacks, means skills or library that can make project more sustainable.

        version1 major stacks

        Typescript(also install eslint), webpack, 


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