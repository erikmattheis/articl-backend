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

const oldArticlTemplate = {
  "id": 73296,
  "date": "2023-09-02T01:56:23",
  "date_gmt": "2023-09-02T01:56:23",
  "guid": {
    "rendered": "https://articl.net/?directory_link=emerging-quantitative-imaging-techniques-in-sports-medicine"
  },
  "modified": "2023-09-02T01:56:23",
  "modified_gmt": "2023-09-02T01:56:23",
  "slug": "emerging-quantitative-imaging-techniques-in-sports-medicine",
  "status": "publish",
  "type": "directory_link",
  "link": "http://localhost/?directory_link=emerging-quantitative-imaging-techniques-in-sports-medicine",
  "title": {
    "rendered": "Emerging Quantitative Imaging Techniques in Sports Medicine."
  },
  "content": {
    "rendered": "",
    "protected": false
  },
  "excerpt": {
    "rendered": "",
    "protected": false
  },
  "author": 3,
  "comment_status": "open",
  "ping_status": "closed",
  "template": "",
  "acf": {
    "directory_link_category": [
      1678
    ],
    "directory_link_resource_type": [
      48
    ],
    "url": "https://pubmed.ncbi.nlm.nih.gov/37552087/",
    "directory_link_type": 10,
    "journal": "Radiology",
    "short-title": "",
    "review-url": "",
    "review-source": "",
    "year": 2023,
    "month": 8,
    "authors": "Hayashi Daichi,Roemer Frank W,Tol Johannes L,Heiss Rafael,Crema Michel D,Jarraya Mohamed,Rossi Ignacio,Luna Antonio,Guermazi Ali,",
    "abstract": "This article describes recent advances in quantitative imaging of musculoskeletal extremity sports injuries, citing the existing literature evidence and what additional evidence is needed to make such techniques applicable to clinical practice. Compositional and functional MRI techniques including T2 mapping, diffusion tensor imaging, and sodium imaging as well as contrast-enhanced US have been applied to quantify pathophysiologic processes and biochemical compositions of muscles, tendons, ligaments, and cartilage. Dual-energy and/or spectral CT has shown potential, particularly for the evaluation of osseous and ligamentous injury (eg, creation of quantitative bone marrow edema maps), which is not possible with standard single-energy CT. Recent advances in US technology such as shear-wave elastography or US tissue characterization as well as MR elastography enable the quantification of mechanical, elastic, and physical properties of tissues in muscle and tendon injuries. The future role of novel imaging techniques such as photon-counting CT remains to be established. Eventual prediction of return to play (ie, the time needed for the injury to heal sufficiently so that the athlete can get back to playing their sport) and estimation of risk of repeat injury is desirable to help guide sports physicians in the treatment of their patients. Additional values of quantitative analyses, as opposed to routine qualitative analyses, still must be established using prospective longitudinal studies with larger sample sizes.© RSNA, 2023.",
    "full-text": "",
    "source": "",
    "image-caption": "",
    "institution": "From the Department of Radiology, Tufts Medical Center, Tufts University School of Medicine, Boston, Mass (D.H.); Quantitative Imaging Center, Department of Radiology, Boston University School of Medicine, Boston, Mass (D.H., F.W.R., M.D.C., A.G.); Department of Radiology, University Hospital Erlangen, Friedrich-Alexander-Universität Erlangen-Nürnberg, Erlangen, Germany (F.W.R., R.H.); University of Amsterdam Academic Center for Evidence-based Sports Medicine, Amsterdam, the Netherlands (J.L.T.); Institute of Sports Imaging, French National Institute of Sports, Paris, France (M.D.C.); Department of Radiology, Massachusetts General Hospital, Harvard Medical School, Boston, Mass (M.J.); Centro Rossi, Buenos Aires, Argentina (I.R.); Department of Radiology, HT Medica, Jaén, Spain (A.L.); and Department of Radiology, VA Boston Healthcare System, Boston University School of Medicine, 1400 VFW Parkway, Suite 1B105, West Roxbury, MA 02132 (A.G.).",
    "description": "",
    "source-id-type": "",
    "source-id": "",
    "thumbnail-image": ""
  },
  "_links": {
    "self": [
      {
        "href": "http://localhost/wp-json/wp/v2/directory_link/73296"
      }
    ],
    "collection": [
      {
        "href": "http://localhost/wp-json/wp/v2/directory_link"
      }
    ],
    "about": [
      {
        "href": "http://localhost/wp-json/wp/v2/types/directory_link"
      }
    ],
    "author": [
      {
        "embeddable": true,
        "href": "http://localhost/wp-json/wp/v2/users/3"
      }
    ],
    "replies": [
      {
        "embeddable": true,
        "href": "http://localhost/wp-json/wp/v2/comments?post=73296"
      }
    ],
    "version-history": [
      {
        "count": 0,
        "href": "http://localhost/wp-json/wp/v2/directory_link/73296/revisions"
      }
    ],
    "acf:term": [
      {
        "embeddable": true,
        "taxonomy": "directory_link_type",
        "href": "http://localhost/wp-json/wp/v2/directory_link_type/10"
      },
      {
        "embeddable": true,
        "taxonomy": "directory_link_resource_type",
        "href": "http://localhost/wp-json/wp/v2/directory_link_resource_type/48"
      },
      {
        "embeddable": true,
        "taxonomy": "directory_link_category",
        "href": "http://localhost/wp-json/wp/v2/directory_link_category/1678"
      }
    ],
    "wp:attachment": [
      {
        "href": "http://localhost/wp-json/wp/v2/media?parent=73296"
      }
    ],
    "curies": [
      {
        "name": "wp",
        "href": "https://api.w.org/{rel}",
        "templated": true
      }
    ]
  }
}
const oldToNewArticl = (oldArticl) => {
  const newArticl = { ...oldArticl };
  newArticl.authors = toAuthorsArray(oldArticl.authors);
  newArticl.authorsOrig = oldArticl.authors;
  newArticl.order = oldArticl.term_order;
  newArticl.affilliations = oldArticl.institution ? [oldArticl.institution.split] : [];
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
  // The records are upserted
  let page = 1; // Change this to the page you want to start importing from
  const perPage = 100; // 100 max. Adjust perPage as needed

  while (true) {
    const data = await fetchArticlsFromLocalWP(page, perPage);



    const records = data.map((articl) => storedArticl(articl));
    console.log("records", records.length);

    const result = await ArticlsWP.bulkWrite(records.map((doc) => ({

      updateOne: {
        filter: { oldId: doc.oldId },
        update: doc,
        upsert: true,
      },

    })));

    console.log(`Imported ${result}`);

    if (data?.length < 100) {
      console.log('No more data to import.');
      break;
    }

    page = page + 1;
  }

  console.log('done');

}


// importArticlsFromLocalWP();

module.exports = {
  importArticlsFromLocalWP,
};
