const httpStatus = require('http-status');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const axiosThrottle = require('axios-request-throttle');
const { Categories } = require('../models');
const categoriesService = require('./categories.service');
const ApiError = require('../utils/ApiError');

const SLUG_ERROR_FILE = '../category-errors.json';
//const CATEGORIES_JSON_FILE = '../models/categories.json';

const existingSlugs = [];
const Articls = require('../models/articls.model');
const ArticlsWP = require('../models/articls.wpPost.model');
const Notes = require('../models/notes.model');

axiosThrottle.use(axios, { requestsPerSecond: 4 });

const toAuthorsArray = (authors) => {
  if (authors) {
    return authors.split(',').map((author) => author.trim());
  }

  return [];
};

const oldToNewArticl = (oldArticl) => {
  const newArticl = { ...oldArticl };
  newArticl.authors = toAuthorsArray(oldArticl.authors);
  newArticl.authorsOrig = oldArticl.authors;
  newArticl.order = oldArticl.term_order;
  newArticl.title = oldArticl.post_title;
  newArticl.slug = oldArticl.directory_link_category?.length ? oldArticl.directory_link_category[0].slug : 0;
  newArticl.articlType = oldArticl?.directory_link_resource_type?.length ? oldArticl.directory_link_resource_type[0].name : 0;
  newArticl.oldId = oldArticl.id;
  newArticl.updatedAt = moment(oldArticl.post_date_gmt, 'DD/MM/YYYY HH:mm:ss').toISOString();
  newArticl.wpPost = oldArticl;
  return newArticl;
}

async function fetchArticlsFromLocalWP(page, perPage) {
  const url = `http://127.0.0.1/wp-json/wp/v2/directory_link?page=${page}&per_page=${perPage}`;
  console.log(`Fetching page ${page} of ${perPage} articls from ${url}...`);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
}

function storedArticl(articl) {
  return { wpPost: articl, oldId: articl?.id };
}

async function importArticlsFromLocalWP() {
  let page = 1;
  const perPage = 10; // Adjust perPage as needed

  while (true && page < 2) {
    const data = await fetchArticlsFromLocalWP(page, perPage);

    if (data.length === 0) {
      console.log('No more data to import.');
      break;
    }

    const records = data.map((articl) => storedArticl(articl));
    console.log("records", records.length);

    const result = await ArticlsWP.bulkWrite(records.map((doc) => ({

      updateOne: {
        filter: { oldId: doc.ID },
        update: doc,
        upsert: true,
      },

    })));

    // console.log(`Imported ${result}`);
    page++;
  }
  console.log('done');
}


importArticlsFromLocalWP();
module.exports = {
  importArticlsFromLocalWP,
};
