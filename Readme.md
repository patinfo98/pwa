# Introduction

## Project Description

- A Progressive Web App (PWA) for creating polls
- The application is deployed on an AWS EC2 instance using Nginx as the web server
- The build, test and deployment processes are automated via GitHub Actions

## Authors

- Noah Dimmer
- Patrick Fössl
- Susanne Jandl
- Stefan Jovic
- Dominik Kainbacher
- Dana-Monica Vlas

## Tasks

- Build project with webpack and automation (Susanne Jandl)
- UI-Tests and automation(Patrick Fössl)
- Backend-Tests (Dominik Kainbacher)
- Backend-Test automation (Dana-Monica Vlas)
- Deployment (Noah Dimmer, Stefan Jovic)
- Anti-Patterns (Patrick Fössl)
- Documentation, Presentation (everyone)

---
# Build project with webpack

Susanne Jandl

## Why use webpack

- Link: [Webpack](https://webpack.js.org)
- bundles modules into optimized files for use in browser
- can bundle multiple files together
- supports code splitting
  - split code into various bundles 
  - bundles can be loaded on demand (lazy loading) or in parallel
  - achieve smaller bundles and control resource load prioritization to reduce load time.
- creates /dist folder for distribution
  - contains production-ready files

## Used plugins and configuration

- configuration for webpack can be found in `webpack.config.js`

### Entry points and output

- index , main and use_serviceworker are defined as entry points
```js
   entry: {
        main: './main.js',
        index: './index.js',
        use_serviceworker: './use_serviceworker.js',
    },
```
- js files are bundled and stored in /dist folder by webpack
```js
   output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
```	
- \[name\] is replaced with the name of each entry point
- ususally use \[name\].bundle.js for output
- `clean: true` cleans the /dist folder before each build

### HtmlWebpackPlugin

- Link: [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- creates HTML files with included js-bundles in /dist folder
- html-loader is required to load html files
- in `webpack.config.js`:
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
...
...

plugins: [
    ...
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['index', 'main', 'use_serviceworker']
        }),
...
```
- template: the html file to be used from project
- filename: the name of the output file in /dist folder
- chunks: entry points to be included in the html file
  - if chunks are not defined all entry points will be included

### CopyWebpackPlugin

- Link: [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/)
- copies files to /dist folder without changes
- used to include json files including data to be used in project

- in `webpack.config.js`:
```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
...
...
plugins: [
    ...
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'data_polls.json'), to: 'data_polls.json' }, 
                { from: path.resolve(__dirname, 'user.json'), to: 'user.json' },
                ...
            ],
        }),
...
```
- from: the path of the file to be copied
- to: the name of the file in /dist folder

### including images

- the first part ensures images are included in /dist folder in an own img folder
- html-loader is required: ensures all necessary files from htmls are included
- (html-loader without first rule would export images to /dist folder, but renamed and in root)

```js
...
module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.html$/i,
                use: 'html-loader',
            },
        ],
    },
...
```

## Example of bundled file

```js
(()=>{let e=!1,n=!1;function t(){e&&n&&(elements.bigCardAnswerOne.addEventListener("click",(function(){o(1)})),elements.bigCardAnswerTwo.addEventListener("click",(function(){o(2)})),elements.outOfPollsButton.addEventListener("click",(function(){seenPolls=[],currentCard=1,updateCards(),r(),a()})),elements.skipButton.addEventListener("click",(function(){l(),d(),updateCards(),-1==currentCard?i():(r(),a())})),elements.bigCardPinButton.addEventListener("click",(function(){l(!0),r(),updateCards()})),-1!=currentCard?r():i())}function r(){const e=pollList.find((e=>e.id==currentCard));let n=!1;for(poll of seenPolls)if(poll.id==currentCard){n=poll.pinned;break}const t=e.votesOne+e.votesTwo+" votes";elements.bigCardName.textContent=e.userName,elements.bigCardVotes.textContent=t,elements.bigCardQuestion.textContent=e.question,elements.bigCardAnswerOne.textContent=e.answerOne,elements.bigCardAnswerTwo.textContent=e.answerTwo,elements.bigCard.style.background=e.color,elements.bigCardPinButton.src=n?"img/simple_pin_filled.svg":"img/simple_pin_outline.svg"}function o(e){for(const n of pollList)if(n.id==currentCard){console.log("running on Card finished: "+n.id+" "+currentCard),1==e?(n.votesOne++,answerCardText.textContent=n.answerOne):(n.votesTwo++,answerCardText.textContent=n.answerTwo);const t=n.votesOne+n.votesTwo,r=Math.round((1==e?n.votesOne:n.votesTwo)/t*100);answerCardPercent.textContent=r+"%",r>50?(answerCardTag.textContent="majority",answerCardTag.style.background="rgb(101 129 35)"):(answerCardTag.textContent="minority",answerCardTag.style.background="rgb(170 106 48)"),l(),d(),updateCards(),s();break}}async function s(){answerCard.style.display="flex",bigCard.style.display="none",setTimeout((function(){-1==currentCard?i():(r(),a())}),500)}function a(){answerCard.style.display="none",outOfPollsContainer.style.display="none",bigCard.style.display="flex"}function i(){answerCard.style.display="none",bigCard.style.display="none",outOfPollsContainer.style.display="flex"}function d(){pollList=function(e){for(let n=e.length-1;n>0;n--){const t=Math.floor(Math.random()*(n+1));[e[n],e[t]]=[e[t],e[n]]}return e}(pollList);const e=seenPolls.map((e=>e.id)),n=pollList.find((n=>!e.includes(n.id)));currentCard=void 0!==n?n.id:-1}function l(e=!1){for(const n of seenPolls)if(n.id==currentCard)return e&&(n.pinned=!n.pinned),void(n.time=new Date);seenPolls.push({id:currentCard,pinned:e,time:new Date})}getData((()=>{e=!0,t()})),window.onload=function(){["bigCard","bigCardName","bigCardVotes","bigCardPinButton","bigCardQuestion","bigCardAnswerOne","bigCardAnswerTwo","skipButton","answerCard","answerCardText","answerCardTag","answerCardPercent","cardId","outOfPollsContainer","outOfPollsButton"].forEach((e=>{elements[e]=document.getElementById(e)})),n=!0,t()}})();
```
---

# Continuous Deployment Documentation
Stefan Jovic

## Infrastructure Overview
The application is deployed on an AWS EC2 instance using Nginx as the web server. The deployment process is automated via GitHub Actions.

### Server Structure
- **Base Path**: `/var/www/pwa/`
    - `current/` -> Symlink to latest release
    - `releases/` -> Contains versioned releases
    - `logs/` -> Application logs

### SSL Configuration
SSL certificates are stored in `/etc/nginx/ssl/`:
- `certificate.crt` - Main certificate
- `ca_bundle.crt` - Certificate chain
- `private.key` - Private key

## Deployment Process

### Release Strategy
- Each deployment creates a new timestamped directory in `/var/www/pwa/releases/`
- The `current` symlink points to the latest release
- Only the last 5 releases are kept for rollback purposes

### GitHub Actions Workflow
The deployment is triggered automatically after successful completion of:
- "Build Project" workflow
- "Node.js CI" workflow

#### Workflow Steps
1. **Environment Setup**
    - Runs on Ubuntu latest
    - Uses Node.js 18
    - Uses npm cache for faster installations

2. **Build Process**
   ```bash
   npm ci
   NODE_ENV=production npm run build
   ```

3. **Deployment Package**
    - Creates `deployment.tar.gz` from the `dist` directory

4. **AWS Authentication**
    - Configures AWS credentials for EC2 access
    - Uses AWS region: eu-central-1

5. **EC2 Deployment**
    - Uploads package to `/tmp/` on EC2
    - Creates timestamped release directory
    - Extracts files and sets nginx:nginx ownership
    - Updates `current` symlink
    - Maintains only last 5 releases

### Security
- Uses SSH key-based authentication
- Implements StrictHostKeyChecking
- Temporary files are cleaned up after deployment

## Server Configuration

### File Permissions
- Application files: `nginx:nginx`
- SSL certificates:
    - Certificate files: `nginx:nginx` (read-only)
    - Private key: `nginx:nginx` (read-only, restricted)

## Required Environment Variables

### GitHub Actions Secrets
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `SSH_PRIVATE_KEY` - SSH private key for EC2 access

### Environment Variables
- `AWS_REGION: eu-central-1`
- `EC2_HOST: ec2-3-64-57-137.eu-central-1.compute.amazonaws.com`
- `DEPLOY_PATH: /var/www/pwa`
- `SSH_USER: ec2-user`
- `AWS_PLATFORM: linux/amd64`

## Maintenance

### SSL Certificates
Location: `/etc/nginx/ssl/`
- Monitor certificate expiration dates
- Ensure proper permissions are maintained
- Keep backup of certificates

### Release Management
- Automatic cleanup keeps last 5 releases
- Manual rollback possible by updating `current` symlink
- Release directory format: `YYYYMMDD_HHMMSS`

## Rollback Procedure
1. SSH into the server
2. Navigate to `/var/www/pwa/`
3. List available releases in `releases/` directory
4. Update symlink to desired release:
   ```bash
   ln -sfn /var/www/pwa/releases/[RELEASE_TIMESTAMP] /var/www/pwa/current
   ```

## Troubleshooting

### Common Issues
1. Failed Deployment
    - Check GitHub Actions logs
    - Verify AWS credentials
    - Ensure SSH key is valid
    - Check disk space on EC2

2. Permission Issues
    - Verify nginx user ownership
    - Check SSH key permissions
    - Validate AWS IAM permissions

## Alternative Approach: ECS Continuous Deployment

For an alternative approach using Amazon ECS for containerized deployments, please refer to the [ECS CD Pipeline Documentation](./.doc/ECS.md), where we explain how to leverage Amazon ECS and GitHub Actions to automate your deployments on a serverless environment using AWS Fargate.