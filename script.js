const searchBox = document.getElementById("livesearch");
const pancakes = document.createElement("span");
const rootElem = document.getElementById("root");
const clive = document.getElementById("pie");
const xp = document.getElementById("chocolatePancakes");
xp.appendChild(pancakes);

function setup() {
  getFetch();
}

function getFetch() {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((episodes) => {
      // changing the json object to the javascript object (.json returns promise)
      return episodes.json();
    })

    .then((data) => {
      console.log(data);
      makePageForEpisodes(data);
      dropDown(data);
      searchFunction(data);
      selectMenu(data);
      console.log("fetched");
    })

    .catch((err) => console.log("err", err));
}

function makePageForEpisodes(episodeList) {
  episodeList.forEach((item) => {
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<div class="episode">
      <h2>${item.name}</h2><div>
      <img src="${item.image.medium}" alt="">
      <br>
      ${item.summary}
      S${item.season.toString().padStart(2, 0)}
      E${item.number.toString().padStart(2, 0)}
      <br>
      <a href=${item.url}>Check the source</a>
    </div>`
    );
  });
}

//creates search box and functionality
function searchFunction(episodeList) {
  searchBox.addEventListener("input", (e) => {
    e.preventDefault();
    const searchString = e.target.value.toLowerCase();
    let filteredEpisodes = episodeList.filter((epis) => {
      return (
        epis.name.toLowerCase().includes(searchString) ||
        epis.summary.toLowerCase().includes(searchString)
      );
    });
    rootElem.innerHTML = "";
    pancakes.innerHTML = `${filteredEpisodes.length}/${episodeList.length} results found.`; //the number of search results.
    makePageForEpisodes(filteredEpisodes);
  });
}
//select drop down bar
function dropDown(arr) {
  let drops = `<option value='1' >See all episodes</option>`;
  arr.forEach((item) => {
    drops += `<option value="${item.id}"> 
      S${item.season.toString().padStart(2, 0)}
      E${item.number.toString().padStart(2, 0)}
      ${item.name}</option>`;
  });
  clive.innerHTML = "";
  clive.insertAdjacentHTML("afterbegin", drops);
}

function selectMenu(episodeList) {
  clive.addEventListener("change", (e) => {
    e.preventDefault();
    const searchId = +e.target.value;
    let filteredList = [];
    console.log(searchId);
    if (searchId === 1) {
      filteredList = episodeList;
    } else {
      filteredList = episodeList.filter((epis) => {
        return epis.id === searchId;
      });
    }
    console.log(searchId);
    rootElem.innerHTML = "";
    makePageForEpisodes(filteredList);
  });
}

window.onload = setup;
