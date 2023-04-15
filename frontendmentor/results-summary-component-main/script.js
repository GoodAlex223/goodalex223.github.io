const categoryList = document.querySelector("#list-container ul");

// TODO: 
// + 1. Add margin to svg image
// + 2. Comment links to google icons(more icons from google icons by dynamicaly fetching links and inserting in html)
// + 3. Make variable fonts from downloaded fonts in project
// 4. Make dynamic
/**
 * @param {string} iconSrc
 * @param {string} categoryName
 * @param {number} categoryScore
 * @return {string}
 */
function createCategoryLi(iconSrc, categoryName, categoryScore){
  return `
  <span class="summary-category">
    <img src="${iconSrc}" rel="icon">
    <span>${categoryName}</span>
  </span>
  <span class="category-result">
    <span class="user-category-score">${categoryScore}</span> / 100
  </span>
  `
}

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    for (category of data) {
        const category_li = document.createElement("li")
        category_li.id = `${category.category}`
        category_li.innerHTML = createCategoryLi(
          category.icon,
          category.category,
          category.score
          )
        // Make color from transparent to $paleBlue(hsla(221, 100%, 96%, n))
        // Where n = (100 - user_category_score) / 100
        // To slightly focus on the user's low scores
        category_li.style.backgroundColor = `hsla(221, 100%, 96%, ${(100 - category.score) / 100})`
        categoryList.appendChild(category_li)
    }


  })
  .catch(error => console.error(error));