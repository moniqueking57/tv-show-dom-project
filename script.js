const searchBox = document.getElementById("livesearch");
const allEpisodes = getAllEpisodes();
const rootElem = document.getElementById("root");

function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
 episodeList.forEach((item) =>{
  //  console.log(item);
  rootElem.insertAdjacentHTML("afterbegin", `<div class="episode">
                            <h2>${item.name}</h2><div>
                            <img src="${item.image.medium}" alt="">
                            <br>
                            ${item.summary}
                            S${item.season.toString().padStart(2, 0)}E${item.number.toString().padStart(2, 0)}
                            <br>
                            <a href=${item.url}>Check the source</a>
                        </div>`)
 })
};




function searchFunction(episodeList){
  searchBox.addEventListener('keypress', (e) => {
    const searchString = e.target.value.toLowerCase();

  let filteredEpisodes = episodeList.filter((epis) => {
        return (
            epis.name.toLowerCase().includes(searchString)      
        );   
    });
   makePageForEpisodes(filteredEpisodes);
}); 
}

searchFunction(allEpisodes);

// fetch('shows.js')
//   .then(response => response.json())
//   .then(searching => {
//   createSearchBar(searching)
//   episodeLists = searching
// })
// let episodeLists = []

// searchBox.addEventListener('input', event => {
//   event.preventDefault()
//   const searchLower = event.target.value.toLowerCase()
//   let searchResult = episodeLists.filter(episodeList => {
//   return episodeList.name.toLowerCase().includes(searchLower)
  
//   })
// createSearchBar(searchResult)
// })

window.onload = setup;
