<h2 align="center"><img height="80" src="https://tap.mn/tapmn.png" /></h2>

<h4 align="center">To integrate your service, you can make a Pull Request with a ready-made React component.</h4>

This repository stores [`back-end`](back-end) and [`front-end`](react-app) code.

### API Documentation

Get it on [Swagger](https://app.swaggerhub.com/apis-docs/kanitelk/tap/)

#### Start Front-End

1. Clone repository

2. Run **`npm install`**

3. Run **`npm run watch`** to development

4. Run **`npm run build`** to build

#### Start Back-End

1. Clone repository

2. Run **`npm install`**

3. Create **`.env`** file in root project directory

```
db=mongodb://localhost:27017/push
port=3003
nodeURL=https://api.minter.one/
explorerURL=https://explorer-api.minter.network/api/v1
chainId=1
b2phoneAPI=https://biptophone.ru/api.php
b2phoneKEY={Bip To Phone API Key}
mailHOST={SMTP Server}
mailPORT={Mail Port}
mailUSER={Mail User}
mailPASS={Mail Password}
sheetsKEY={Google sheets API KEY}
```

4. Run **`npm run watch`** to development

5. Run **`npm run build`** to build
