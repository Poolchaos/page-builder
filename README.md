# Page Builder

## Usage

To develop on this project please clone it and follow the steps below: 

0.   After cloned cd into project folder and run: `npm install`

0.   Install the web server: `npm install git+ssh://git@bitbucket.org:zaralab/web-server -g`

0.   Install jspm `npm install jspm -g` (only needed once) then run: `jspm install -y`

0.   Install jspm git for custom registry: `npm install jspm-git -g` (only needed once) then create (use `ssh://git@gitlab.com/` as base url when prompted): `jspm registry create gitlab jspm-git`

     > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm registry config github` and following the prompts. If you choose to authorize jspm by an access token instead of giving your password (see GitHub `Settings > Personal Access Tokens`), `public_repo` access for the token is required.

     >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install -y`.

0.   Run application: `gulp`

0.   `gulp watch` notices when you make a change and reloads the browser.
