const USDA_List_URL = 'https://api.nal.usda.gov/ndb/list';
const USDA_Nutrient_Search_URL = 'https://api.nal.usda.gov/ndb/nutrients/';
const Yummly_URL = 'https://api.yummly.com/v1/api/recipes';
const Yummly_Recipe_URL = 'https://api.yummly.com/v1/api/recipe/';
var ID_List = [];

function start() {
  getNutrientID(generateNutritionID);
  handleNutrientButton();
  handleRecipeButton();
}

function getNutrientID(callback) {
  const IDList = {
    url: USDA_List_URL,
    data: {
      api_key: 'CpBKCl815ug26WnIn9qO20akfYXe0UL2L6dGQ0oO',
      lt: 'nr',
      max: 150,
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(IDList);
}

function renderIDs(list) {
  //console.log("list output:",list);
  ID_List.push(list);
  //console.log("full list:",ID_List);
}

function generateNutritionID(data) {
  //console.log(data.list.item);
  const results = data.list.item.map((item, index) => renderIDs(item));
  ID_List = ID_List.slice(-98);
  //console.log("final list:",ID_List);
  populateNutientDropdown(ID_List);
}

function populateNutientDropdown (list) {
  //console.log(list);
  const dropdown = list.map((item, index) =>renderDropdown(item));
  //console.log(dropdown);
  $('.js-nutrient-input-list').html(dropdown);
}

function renderDropdown(nutrient) {
  //console.log("this thing:",nutrient);
  return `
  <option>${nutrient.name}</option>`;
}

function handleNutrientButton() {
  $('.nutrient-button').on('click', event => {
    $('.js-food-search-results').html(`<span class="sr-only">Loading...</span>`);
    const nQuery = $('#nutrient-input').val();
    //console.log(nQuery);
    var nObject = ID_List.find(object=> {
     return object.name === nQuery; 
    });
    var nID = nObject.id;
    getFoodList(nID, displayFoodList);
  });
}

function getFoodList (search, callback) {
  const foodList = {
    url: USDA_Nutrient_Search_URL,
    data: {
      api_key: 'CpBKCl815ug26WnIn9qO20akfYXe0UL2L6dGQ0oO',
      max: 20,
      nutrients: `${search}`,
      sort: 'c',
      subset: 1
    }, 
    dataType: 'json',
    type: 'GET',
    success: callback,
    error: (e) => console.log(e)
  };
  //console.log('checkin', foodList);
  $.ajax(foodList);
}

function displayFoodList (data) {
  //console.log("testing display:", data.report.foods);
  const results = data.report.foods.map((item, index) => renderFoodList(item));
  $('.js-food-search-results').html(results);
}

function renderFoodList (food) {
  //console.log(food);
  return `
    <div class="food"><li>${food.name}</li></div>
  `;
}

function handleRecipeButton() {
  $('.recipe-finder').on('submit', event => {
    event.preventDefault();
    $('.js-recipe-search-results').html(`<span class="sr-only">Loading...</span>`);
    const fQuery = $('#food-input').val();
    //console.log("food is",fQuery);
    getRecipeList(fQuery,displayRecipeList);
  });
}

function getRecipeList (search,callback) {
  const recipeList = {
    url: Yummly_URL,
    data: {
      _app_id: 'bd4896f0',
      _app_key: '39eeada0a2ae941aabfd32ef3e0a2292',
      q: `${search}`,
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    error: (e) => console.log(e)
  };
   $.ajax(recipeList);
}

function displayRecipeList(data) {
  //console.log(data);
  const results = data.matches.map(renderRecipeList);
  $('.js-recipe-search-results').html(results);
}

function renderRecipeList (item) {
  //console.log('each item',item);
  return `
  <div style='cursor: pointer;' class='recipe' id="${item.id}">
  <h4> <img src='${item.smallImageUrls}' alt='${item.recipeName}'/>${item.recipeName}</h4>
  </div>
  `;
}

$('.js-recipe-search-results').on('click', '.recipe', function(event) {
  console.log($(this).attr('id'));
  getRecipe($(this).attr('id'));
});

function getRecipe (recipeId) {
  const recipePage = {
    url: Yummly_Recipe_URL + recipeId,
    data: {
      _app_id: 'bd4896f0',
      _app_key: '39eeada0a2ae941aabfd32ef3e0a2292'
    },
    dataType: 'json',
    type: 'GET',
    success: displayRecipe,
    error: (e) => console.log(e)
  };
  //console.log(recipePage);
  $.ajax(recipePage);
}

function displayRecipe(data) {
  //console.log(data);
   window.open(data.source.sourceRecipeUrl, '_blank');
}

$(start);