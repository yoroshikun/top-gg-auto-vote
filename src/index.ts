const puppeteer = require('puppeteer');
const config = {
  BOT_ID: '773585165317570610',
  BOT_NAME: 'GenshinUtils',
};

const COOKIE = process.env.COOKIE;

const wait = (ms: number) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(null);
    }, ms)
  );

async function vote() {
  if (!config.BOT_ID) return console.error('Config BOT_ID is missing');
  if (!config.BOT_NAME) return console.error('Config BOT_NAME is missing');
  if (!COOKIE) return console.error('Config COOKIE is missing');

  console.info(`Trying to vote for ${config.BOT_NAME}...`);

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = (await browser.pages())[0];

  await page.setCookie({
    name: 'connect.sid',
    value: COOKIE,
    domain: 'top.gg',
    path: '/',
    url: 'https://top.gg',
  });

  await page.goto(`https://top.gg/bot/${config.BOT_ID}/vote`);

  await wait(21000);

  await page.click('#votingvoted');

  await wait(2000);

  console.info('Sucessfully voted');

  browser.close();
}

vote();
