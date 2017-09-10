const USDA_List_URL = 'https://api.nal.usda.gov/ndb/list';
const USDA_Nutrient_Search_URL = 'http://api.nal.usda.gov/ndb/nutrients/';
var ID_List = [];

function start() {
  getNutrientID(generateNutritionID);
  handleNutrientButton();
  //handleRecipieButton();
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
  //console.log(data);
  const results = data.list.item.map((item, index) => renderIDs(item));
  ID_List = ID_List.slice(-99);
  //console.log("final list:",ID_List);
  populateNutientDropdown(ID_List);
}

function populateNutientDropdown (list) {
  //console.log(list);
  const dropdown = list.map((item, index) =>renderDropdown(item));
  $('.js-nutrient-input-list').html(dropdown);
}

function renderDropdown(nutrient) {
  //console.log("this thing:",nutrient);
  return `
  <option>${nutrient.name}</option>`;
}

function handleNutrientButton() {
  $('.nutrient-button').on('click', event => {
    const nQuery = $('#nutrient-input').val();
    //console.log(nQuery);
    var nObject = ID_List.find(object=> {
     return object.name === nQuery; 
    });
    var nID = nObject.id;
    getFoodList(nID);
  });
}

function getFoodList (ndbno) {
  
}

$(start);