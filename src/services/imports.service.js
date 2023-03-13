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
const Notes = require('../models/notes.model');



axiosThrottle.use(axios, { requestsPerSecond: 4 });

const slugify = (slug) => {
  let str = slug.replace(/\s/g, '-');
  str = str.toLowerCase();
  str = str.length ? str : 0;

  return encodeURIComponent(str);
};

const toSlug = (slug, name) => {
  try {
    if (slug) {
      return slugify(slug);
    }
    if (!slug && name) {
      return slugify(name);
    }
    if (!slug) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Could not convert to suitable slug.',
      );
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}7`);
  }
};

const wpCategoryToNodeCategory = (old) => {
  try {
    const newObj = {
      oldId: Number(old.term_id),
      title: old.name,
      titleHtml: old.html_title ? old.html_title : '',
      slug: toSlug(old.slug, old.name),
      description: old.description ? old.description : '',
      oldParentId: Number(old.parent) ? Number(old.parent) : 0,
      parentSlug: '0',
      image: old.category_image ? old.category_image : '',
      order: old.term_order ? Number(old.term_order) : 0,
    };
    return newObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}6`);
  }
};

/*
/**
 * Get a category
 * @returns {Promise<Categories>}
 
const getCategories = async () => {
  try {
    const rawData = fs.readFileSync(
      path.resolve(__dirname, CATEGORIES_JSON_FILE),
    );
    const data = JSON.parse(rawData);
    return data.categories;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error} 44    sx`);
  }
};
*/
const loopThroughOldAndCreateNew = async (categories, reallySave = false) => {

  for (let n = 0, i = 0; i < categories.length; i += 1) {

    const category = wpCategoryToNodeCategory(categories[i]);

    const { slug } = category;

    const slugExists = await Categories.isCategorySlug(slug);

    if (!slugExists || slug === 0 || slug === '0') {
      if (reallySave) {
        await categoriesService.upsertCategory(category);
        n += 1;
      }
    } else {
      existingSlugs.push(categories[i]);
    }
  }
  const result = await Categories.find();
  return result;

};

const oldIdToParentSlug = async (oldParentId) => {
  try {
    const id = oldParentId || 0;
    const parent = await categoriesService.getCurrentCategorySlugByOldId(id);
    if (parent.slug) {
      return parent.slug;
    }
    return parent.title;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error} 22 `);
  }
};

const loopThroughAndChangeParentSlug = async (categories) => {
  for (const category of categories) {
    const slug = await categoriesService.getCurrentCategorySlugByOldId(
      category.oldId,
    );
    const num = await Categories.updateMany(
      { oldParentId: category.oldId },
      { parentSlug: slug },
    );
  }

  const result = await Categories.find();
  return result;
};

const importArticlsByChr = async (chr) => {

  let categories = await getCategories();

  categories = categories.filter((cat) => cat.html_title.charAt(0).toLowerCase() === chr.toLowerCase());
  console.log('importing articls in', categories.length, 'categories beginning with', chr);
  let n = 0;
  for (const category of categories) {

    let articls = await getArticls(category.slug);

    if (articls.length) {
      n += articls.length;

      articls = articls.map((articl) => oldToNewArticl(articl));

      const result = await Articls.bulkWrite(articls.map((doc) => ({

        updateOne: {
          filter: { oldId: doc.ID },
          update: doc,
          upsert: true,
        },

      })));
    }
  }


  const nextChr = chr.charCodeAt(0) + 1;

  if (nextChr < 123) {
    return String.fromCharCode(nextChr);
  }

  return null;
};

const importArticls = async (chr) => {

  let categories = await getCategories();

  categories = categories.filter((cat) => cat.html_title.charAt(0).toLowerCase() === chr.toLowerCase());
  console.log('importing articls in', categories.length, 'categories beginning with', chr);
  let n = 0;
  for (const category of categories) {

    let articls = await getArticls(category.slug);

    if (articls.length) {

      n += articls.length;

      articls = articls.map((articl) => oldToNewArticl(articl));

      const result = await Articls.bulkWrite(articls.map((doc) => ({

        updateOne: {
          filter: { oldId: doc.ID },
          update: doc,
          upsert: true,
        },

      })));
    }
  }


  const nextChr = chr.charCodeAt(0) + 1;

  if (nextChr < 123) {
    return String.fromCharCode(nextChr);
  }

  return null;
};

const importAllArticls = async () => {

  let categories = await getCategoriesWithoutImportedArticls();

  for (const category of categories) {

    let articls = await getArticls(category.slug);
    
    if (articls.length) {

      articls = articls.map((articl) => oldToNewArticl(articl));

      const result = await Articls.bulkWrite(articls.map((doc) => ({
        updateOne: {
          filter: { oldId: doc.ID },
          update: doc,
          upsert: true,
        },
      })));

      await categoriesService.markCategoryArticlsImported(category.slug);
    }
  }

  return null;
};

const toAuthorsArray = (authors) => {
  if (authors) {
    return authors.split(',').map((author) => author.trim());
  }

  return [];
};

const importNotesByChr = async (chr, userId) => {
  let categories = await getCategories();
  let n = 0;
  categories = categories.filter((cat) => cat.html_title.charAt(0).toLowerCase() === chr.toLowerCase());

  for (const category of categories) {
    let notes = await getNotes(category.slug);

    n += notes.length;
    notes = notes.map((note) => oldToNewNote(note, userId));

    const result = await Notes.bulkWrite(notes.map((doc) => ({

      updateOne: {
        filter: { oldId: doc.id },
        update: doc,
        upsert: true,
      },

    })));
  }
  return n;
};

const importNotes = async (userId) => {

  let notes = await getNotes();
  let n = 0;

  console.log('the first note', notes[0]);
  
  n += notes.length;
  notes = notes.map((note) => oldToNewNote(note, userId));

  const result = await Notes.bulkWrite(notes.map((doc) => ({
    updateMany: {
      filter: { oldId: doc.id },
      update: doc,
      upsert: true,
    },

  })));

  return n;
};

const oldToNewArticl = (oldArticl) => {
  const newArticl = { ...oldArticl };
  newArticl.authors = toAuthorsArray(oldArticl.authors);
  newArticl.authorsOrig = oldArticl.authors;
  newArticl.order = oldArticl.term_order;
  newArticl.title = oldArticl.post_title;
  newArticl.slug = oldArticl.directory_link_category?.length ? oldArticl.directory_link_category[0].slug : 0;
  newArticl.type = oldArticl?.directory_link_resource_type?.length ? oldArticl.directory_link_resource_type[0].name : 0;
  newArticl.oldId = oldArticl.ID;
  newArticl.updatedAt = moment(oldArticl.post_date_gmt, 'DD/MM/YYYY HH:mm:ss').toISOString();
  newArticl.wpPost = oldArticl;
  return newArticl;
}

const oldToNewNote = (oldNote, authorId) => {
  //console.log('oldNote', oldNote);
  //process.exit();
  const newNote = { ...oldNote };

  const hashtagRegex = /#[A-Za-z0-9_\-]+/g;
  const match = hashtagRegex.exec(oldNote.content.rendered);
  const hashtag = match ? match[0].substring(1) : '0';

  newNote.author = authorId;
  newNote.fullText = oldNote.content.rendered;
  newNote.title = oldNote.title.rendered;
  newNote.excerpt = oldNote.excerpt.rendered;
  newNote.slug = hashtag;
  newNote.oldId = oldNote.id;
  newNote.wpNote = oldNote;
  newNote.authorHandle = oldNote.author_name?.data?.user_nicename;
  return newNote;
}

const getCategoriesWithoutImportedArticls = async () => {
  const categories = await getCategories();
  const importedCategories = await Categories.find({wpArticlsImported:false});

  return importedCategories;
}

const getCategories = async () => {
  const result = await axios.get(`https://articl.net/wp-json/articl/v1/articl_get_articl_heirarchy`);

  return result.data.categories;
};

const getArticls = async (slug) => {
  const articls = await axios.get(`https://articl.net/wp-json/articl/v1/articl_get_articls?category=${slug}`);

  return articls.data;
};

const getNotes = async () => {
  const notes = await axios.get(`http://articl.net/wp-json/articl/v1/articl_get_public_notes?per_page=10000`);

  return notes.data;
};

const importCategories = async () => {
  const start = new Date();

  let categories = await getCategories();
  categories = await loopThroughOldAndCreateNew(categories, true);
  categories = await Categories.find();
  categories = await loopThroughAndChangeParentSlug(categories);

  const updateNum = categories.length;

  const stop = new Date();

  const time = (stop - start) / 1000;

  if (existingSlugs.length) {
    fs.writeFileSync(SLUG_ERROR_FILE, JSON.stringify(existingSlugs));
  }

  return {
    updateNum,
    time,
  };

};

module.exports = {
  importCategories,
  importArticlsByChr,
  importAllArticls,
  importNotesByChr,
  importNotes,
};
