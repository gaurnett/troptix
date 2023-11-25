import { Resend } from 'resend';
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const puppeteer = require("puppeteer");
const awsChromium = require("@sparticuz/chromium");
// const chromium = require('chrome-aws-lambda');
// const { chromium } = require('playwright-core');
// const chromium = require('@sparticuz/chrome-aws-lambda');

// const chromium = require('chrome-aws-lambda');
const playwright = require('playwright-core');

// stripe trigger payment_intent.succeeded
// stripe listen --forward-to localhost:3001/api/orders

sgMail.setApiKey(process.env.RESEND_DYNAMIC_TEMPLATE_API);

const data = {
  font: {
    "color": "green",
    "include": "https://api.****.com/parser/v3/css/combined?face=Kruti%20Dev%20010,Calibri,DevLys%20010,Arial,Times%20New%20Roman"
  },
  testData: [
    {
      "name": "<p><span class=\"T1\" style=\"font-family:'DevLys 010'; margin: 0;\">0-06537 esa 5 dk LFkuh; eku gS&</span></p>"
    }]
};

async function gethtmltopdf(response) {
  try {
    // const filePathName = path.resolve(__dirname, '/test.ejs');
    // const htmlString = fs.readFileSync(filePathName).toString();
    // let options = { format: 'Letter' };
    // const ejsData = ejs.render(htmlString, data);
    var data = fs.readFileSync(__dirname + '/emails/ticket-pdf.ejs', 'utf8', function (err, content) {
      if (err) {
        return err;
      }
    });


    var content = ejs.render(data, {
      // student: {
      //   "name": "Reddy Sai",
      //   "couse_name": "Software Engineering Training",
      //   "grade": "55.7",
      //   "completion_date": "22-Feb-2019"
      // }
    });

    // console.log("Hello : " + chromium.defaultViewport);
    // console.log("Hello 1: " + await chromium.executablePath);

    // const browser = await chromium.puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    //   headless: chromium.headless,
    //   ignoreHTTPSErrors: true,
    // });

    console.log("Hello 1");

    // await chromium.puppeteer.launch({
    //   args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    //   headless: true,
    //   ignoreHTTPSErrors: true,
    // })

    const browser = await puppeteer.launch({ headless: 'new' });
    console.log("Path 1: " + await awsChromium.executablePath());
    // const browser = await chromium.puppeteer.launch({
    //   args: awsChromium.args,
    //   defaultViewport: awsChromium.defaultViewport,
    //   executablePath: await awsChromium.executablePath(),
    //   headless: awsChromium.headless,
    //   ignoreHTTPSErrors: true,
    // });

    console.log("Hello 2");
    const page = await browser.newPage();
    console.log("Hello 3");
    await page.goto("https://example.com");
    console.log("Hello 4");

    // const [page] = await browser.pages();

    // const html = await ejs.renderFile("invoice.ejs", { user: userData });
    // await page.setContent(content);

    const pdfFile = await page.pdf({ format: "letter" });

    // response.contentType("application/pdf");

    // optionally:
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=invoice.pdf"
    // );

    // response.send(pdfFile);

    await browser.close();

    return pdfFile.toString('base64');
  } catch (err) {
    console.log("Error processing request: " + err);
  }
};

export async function sendEmailToUser(order, orderMap) {

  const templateData = {
    id: order.id,
    eventTitle: order.event.name,
    subtotal: order.subtotal,
    totalFees: order.fees,
    totalPrice: order.total,
    username: order.name,
    cardType: order.cardType,
    cardLast4: order.cardLast4,
    ticketsPurchased: order.tickets.length,
    orderNumber: String(order.id).slice(3),
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    orders: Array.from(orderMap.values())
  }

  const msg = {
    to: order.email,
    from: 'flowersgaurnett@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    templateId: 'd-658d88a06f0b443ca36d12d5e47e9275',
    dynamicTemplateData: templateData,
  };

  return await sgMail.send(msg);
}