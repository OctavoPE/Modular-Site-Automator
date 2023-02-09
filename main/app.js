const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');

/**
 * Created by Jeanmarco Allain; Jan 2023
 * Eventually, user will be able to insert their own URL.
 */

const webpage="https://myanimelist.net/register.php";

(async () => {
    const browser = await puppeteer.launch({headless: false}); // should it be headless in the future?
    const page = await browser.newPage();

    await page.goto(webpage); // travel to user specified webpage

    console.log("Waiting for website...");
    // wait for website to load
    await waitTillHTMLRendered(page)

    console.log('Done waiting for website');
    
    // FIND all elements of type INPUT.
    // INPUT TYPES: https://www.w3schools.com/html/html_form_input_types.asp
    const foundInputElements = await page.$$('input');
    for await (const element of foundInputElements){
      // Get the type of the input element; arrow func controls what is returned.
      const getItemType = await page.evaluate(item => item.type, element);
      
      // How to process the specific input element
      if(getItemType == "email"){
        console.log("Filling out email input");
        await element.type('Email Here');
      }
      else if (getItemType == "password"){
        console.log("Filling out password input");
        await element.type('Password Here');
      }
      else if (getItemType == "text"){
        console.log("Filling out text input");
        await element.type('Text here');
      }
    }


})();

// https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
const waitTillHTMLRendered = async (page, timeout = 30000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
  
    while(checkCounts++ <= maxChecks){
      let html = await page.content();
      let currentHTMLSize = html.length; 
  
      let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
      console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
  
      if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
        countStableSizeIterations++;
      else 
        countStableSizeIterations = 0; //reset the counter
  
      if(countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully..");
        break;
      }
  
      lastHTMLSize = currentHTMLSize;
      await page.waitForTimeout(checkDurationMsecs);
    }  
  };