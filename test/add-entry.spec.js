import puppeteer from 'puppeteer'
import path from 'path'
import "regenerator-runtime/runtime"

let page;
let browser;
const addEntryPage = `file://${path.resolve('add-entry.html')}`
const width = 1440;
const height = 900;

describe('add-entry HTML', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
  });
  afterAll(async () => {
    await page.goto(addEntryPage);
    await page.screenshot({path: 'add-entry.png'});
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({path: 'add-entry-xs.png'});
    browser.close();
  });

  it('Should show alert box if inputs are wrong', async () => {
    await page.goto(addEntryPage);
    await page.type('#hft-shoutbox-form-input-name', 'Ya');
    await page.type('#hft-shoutbox-form-textarea', '123456789');
    await page.focus('#hft-shoutbox-form-submit');
    await page.screenshot({path: 'add-entry-show-alert.png'});
    
    const displayStyle = await page.$eval('#hft-shoutbox-alert', (elem) => {
      return window.getComputedStyle(elem).getPropertyValue('display')
    });
    
    expect(displayStyle).toBe('block')
  });

  it('Should hide alert box if inputs are ok', async () => {
    await page.goto(addEntryPage);
    await page.type('#hft-shoutbox-form-input-name', 'Yas');
    await page.type('#hft-shoutbox-form-textarea', '1234567890');
    await page.focus('#hft-shoutbox-form-submit');
    
    const displayStyle = await page.$eval('#hft-shoutbox-alert', (elem) => {
      return window.getComputedStyle(elem).getPropertyValue('display')
    });
    
    expect(displayStyle).toBe('none')
  });
});
