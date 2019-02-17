//Required libraries for scraping
let Promise = require('promise');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

//List of promises to create
let LPromisesIndiv = [];
let LPromises = [];
let LHotels = [];
let scrapingRound = 1;

//Creating promises
function createPromise() {
  let url = 'https://www.relaischateaux.com/fr/site-map/etablissements';
  LPromises.push(fillHotelsList(url));
  console.log("Relais et Chateaux hotels added to the list");
}

function createIndividualPromises() {
  return new Promise(function(resolve) {
    if (scrapingRound === 1) {
      for (let i = 0; i < Math.trunc(LHotels.length / 2); i++) {
        let hotelURL = LHotels[i].url;
        LPromisesIndiv.push(fillHotelInfo(hotelURL, i));
        console.log("Added url of the " + i + " hotel to the promises list");
      }
      resolve();
      scrapingRound++;
    } else if (scrapingRound === 2) {
      for (let i = LHotels.length / 2; i < Math.trunc(LHotels.length); i++) {
        let hotelURL = LHotels[i].url;
        LPromisesIndiv.push(fillHotelInfo(hotelURL, i));
        console.log("Added url of the " + i + "the hotel to the promises list");
      }
      resolve();
    }
  })
}

//Fetching list of hotels
function fillHotelsList(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, html) {
      if (err) {
        console.log(err);
        return reject(err);
      } else if (res.statusCode !== 200) {
        err = new Error("Unexpected status code : " + res.statusCode);
        err.res = res;
        return reject(err);
      }
      let $ = cheerio.load(html);

      let hotelsFrance = $('h3:contains("France")').next();
      hotelsFrance.find('li').length;
      hotelsFrance.find('li').each(function() {
        let data = $(this);
        let url = String(data.find('a').attr("href"));
        let name = data.find('a').first().text();
        name = name.replace(/\n/g, "");
        let chefName = String(data.find('a:contains("Chef")').text().split(' - ')[1]);
        chefName = chefName.replace(/\n/g, "");
        LHotels.push({
          "name": name.trim(),
          "postalCode": "",
          "chef": chefName.trim(),
          "url": url,
          "price": ""
        })
      });
      resolve(LHotels);
    });
  });
}

//Getting all detailed info for the JSON file
function fillHotelInfo(url, index) {
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, html) {
      if (err) {
        console.error(err);
        return reject(err);
      } else if (res.statusCode !== 200) {
        err = new Error("Unexpected status code : " + res.statusCode);
        err.res = res;
        return reject(err);
      }

      const $ = cheerio.load(html);

      $('span[itemprop="postalCode"]').first().each(function() {
        let data = $(this);
        let pc = data.text();
        LHotels[index].postalCode = String(pc.split(',')[0]).trim();
      });

      $('.price').first().each(function() {
        let data = $(this);
        let price = data.text();
        LHotels[index].price = String(price);
      });
      console.log("Added postal code and price of " + index + "th hotel");
      resolve(LHotels);
    });
  });
}

//Saving the file as ListeRelais.json
function saveHotelsInJson() {
  return new Promise(function(resolve) {
    try {
      console.log("Editing JSON file");
      let jsonHotels = JSON.stringify(LHotels);
      fs.writeFile("ListeRelais.json", jsonHotels, function doneWriting(err) {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.error(error);
    }
    resolve();
  });
}


//Main()
createPromise();
let prom = LPromises[0];
prom
  .then(createIndividualPromises)
  .then(() => {
    return Promise.all(LPromisesIndiv);
  })
  .then(createIndividualPromises)
  .then(() => {
    return Promise.all(LPromisesIndiv);
  })
  .then(saveHotelsInJson)
  .then(() => {
    console.log("JSON file OK")
  });

module.exports.getHotelsJSON = function() {
  return JSON.parse(fs.readFileSync("ListeRelais.json"));
};