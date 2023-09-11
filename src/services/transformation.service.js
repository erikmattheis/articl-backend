
const ApiError = require('../utils/ApiError');

const Articls = require('../models/articls.model');

const ArticlsWPS = require('../models/articls.wpPost.model');

const Categories = require('../models/categories.model');

let categories;

const importsService = require('./imports.service');

const deleteDuplicateArticls = async () => {

  const recentArticls = await ArticlsWPS.aggregate([
    {
      $group: {
        _id: '$oldId',
        mostRecent: { $max: '$_id' } // Find the most recent _id for each oldId
      }
    }
  ]);
  console.log("recentArticls", recentArticls.length);
  // Step 2: Delete older documents based on their _id values
  for (const recent of recentArticls) {
    await ArticlsWPS.deleteMany({ oldId: recent._id, _id: { $ne: recent.mostRecent } });
  }

  console.log('done');

}

// deleteDuplicateArticls();




async function eliminateDuplicateArticls() {

  const mostRecentDocs = await ArticlsWPS.aggregate([
    {
      $group: {
        _id: '$oldId',
        mostRecent: { $max: '$_id' }
      }
    }
  ]);

  const idsToKeep = mostRecentDocs.map(doc => doc.mostRecent);

  const deleteResult = await ArticlsWPS.bulkWrite([
    {
      deleteMany: {
        filter: {
          _id: { $nin: idsToKeep }
        }
      }
    }
  ]);

  console.log(`Deleted ${deleteResult.deletedCount} documents.`);
}

// eliminateDuplicateArticls();

const wpToMongo = (oldDocument) => {
  const newDocument = {
    // Extract data from the original document
    oldId: oldDocument.oldId,
    title: oldDocument.wpPost.title.rendered,
    authors: oldDocument.wpPost.acf.authors.split(',').map((author) => author.trim()),
    articlType: oldDocument.wpPost.type,
    abstract: oldDocument.wpPost.acf.abstract,
    url: oldDocument.wpPost.acf.url,
    journal: oldDocument.wpPost.acf.journal,
    month: oldDocument.wpPost.acf.month,
    year: oldDocument.wpPost.acf.year,

    resourceType: oldDocument.wpPost.acf.directory_link_resource_type?.[0],

    reviewSource: oldDocument.wpPost.acf['review-source'],
    reviewUrl: oldDocument.wpPost.acf['review-url'],
    shortTitle: oldDocument.wpPost.acf['short-title'],
    source: oldDocument.wpPost.acf.source,
    sourceId: oldDocument.wpPost.acf['source-id'],
    sourceIdType: oldDocument.wpPost.acf['source-id-type'],
    institution: oldDocument.wpPost.acf.institution,
    description: oldDocument.wpPost.acf.description,
    fullText: oldDocument.wpPost.acf['full-text'],
    imageCaption: oldDocument.wpPost.acf['image-caption'],
    thumbnailImage: oldDocument.wpPost.acf['thumbnail-image'],
    imageLocalPath: '',
    imageOriginalUrl: '',
    imageRemotePath: '',
    slug: importsService.slugify(getSlugFromOldSlugId(oldDocument.wpPost?.acf?.directory_link_category[0])),
    createdAt: new Date(oldDocument.wpPost.date),
    wpPost: oldDocument.wpPost,
  };

  return newDocument;
}

const resourceTypeMap = {
  48: 'Review (OA)',
  59: 'Review (PA)',
  60: 'Research (OA)',
  61: 'Research (PA)',
  102: 'Web',
  103: 'Images',
  57: 'Presentations',
  53: 'Videos',
  58: 'Podcast'
};

function getSlugFromOldSlugId(id) {
  const category = categories.find((category) => category.oldId === id);

  return category ? category.slug : '';
}

async function transformArticlRecords() {
  try {

    categories = await Categories.find({});

    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const articlwpsData = await ArticlsWPS.find({}).skip((page - 1) * 1000).limit(1000); // Query 1000 articlwps documents at a time
      console.log('importing page', page);

      const transformedData = [];

      for (const oldDocument of articlwpsData) {
        const slug = getSlugFromOldSlugId(oldDocument.wpPost.acf.directory_link_category[0]);

        const newDocument = wpToMongo(oldDocument);


        transformedData.push(newDocument);
      }

      console.log('transformedData.length', transformedData.length);

      await Articls.bulkWrite(transformedData.map((newDocument) => ({
        insertOne: {
          document: newDocument
        }
      })));

      page++;
      console.log('page', page);
      hasMore = articlwpsData.length === 1000;
    }
  } catch (error) {
    console.error(error);
  }
}


// transformArticlRecords();

module.exports = {
  transformArticlRecords,
};
