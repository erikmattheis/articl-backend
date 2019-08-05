let categoryNames;

async function getAPICategoryNames() {
  return $.ajax({
    type: 'GET',
    url: 'https://api.articl.net/api/v1/categories',
    dataType: 'json',
    timeout: 5000,
    success(data) {
      categoryNames = data;
      return data;
    },
    failure(error) {
      throw new Error(`Getting categories failed! The server said: ${error}`);
    }
  });
}
async function getCategoryNames() {
  try {
    if (categoryNames) {
      return categoryNames;
    }
    const result = await getAPICategoryNames();
    return result;
  } catch (error) {
    throw error;
  }
}

async function init() {
  try {
    console.log('getting category names');
    categoryNames = await getCategoryNames();
    console.log('done getting category names');
  } catch (error) {
    throw new Error(error);
  }
}

init();

export { getCategoryNames, getAPICategoryNames };
