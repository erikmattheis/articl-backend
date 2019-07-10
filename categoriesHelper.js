const fs = require('fs');


let data = fs.readFileSync('./category.json', 'utf8');
data = JSON.parse(data);
const { categories } = data;
console.log('do open');
console.log(categories[1]);

module.exports.categories = categories;
