//Required libraries
const scrape = require('./scraping.js');
const michelinScrape = require('./michelin.js');
let fs = require('fs');

'use strict';

const hotelJSON = scrape.getHotelsJSON();
const JSONMichelin = michelinScrape.getRestaurantsJSON();

fs.writeFileSync("RelaisEtoiles.json", JSON.stringify(findMutualChefsAndPCs(hotelJSON, JSONMichelin)));

function findMutualChefsAndPCs(LHotels, LMichelin) {
  let HotelsEtoiles = [];
  for (let i = 0; i < LHotels.length; i++) {
    for (let j = 0; j < LMichelin.length; j++) {
      if (LHotels[i].chef === LMichelin[j].chef && LHotels[i].postalCode === LMichelin[j].postalCode) {
        HotelsEtoiles.push({
          "hotelName": LHotels[i].name,
          "restaurantName": LMichelin[j].name,
          "postalCode": LHotels[i].postalCode,
          "chef": LHotels[i].chef,
          "url": LHotels[i].url,
          "price": LHotels[i].price
        })
      }
    }
  }
  return HotelsEtoiles;
}

console.log("Fichier écrit.");