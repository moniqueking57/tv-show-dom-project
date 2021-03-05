const searchBox = document.getElementById("livesearch");
const searchForEpisodes = document.getElementById("span");
const rootElem = document.getElementById("root");
const showDropBar = document.getElementById("showBar");
const episodeDropBar = document.getElementById("episodeBar");
const xp = document.getElementById("search");
xp.appendChild(searchForEpisodes);

function setup() {
  let showList = getAllShows();
  showList.sort(function (a, b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  dropDown2(showList);
  selectMenu2(showList);
  makePageForShows(showList);
}

function getFetch(showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((episodes) => {
      return episodes.json();
    })
    .then((data) => {
      makePageForEpisodes(data);
      makePageForShows(data);
      dropDown(data);
      searchFunction(data);
      selectMenu(data);
    })
    .catch((err) => console.log("error", err));
}

function makePageForEpisodes(episodeList) {
  episodeList.forEach((item) => {
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<div class="episode">
      <h2>${item?.name}</h2><div>
      <img src="${item.image?.medium}" alt="">
      <br>
      <div class="summary">${item?.summary}</div>
      S${item?.season.toString().padStart(2, 0)}
      E${item?.number.toString().padStart(2, 0)}
      <br>
      <a class="url" href=${item?.url}>Check the source</a>
    </div>`
    );
  });
}

function makePageForShows(showList) {
  showList.forEach((item) => {
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<h2>${item?.name}</h2><div>
      <div class="shows">
      <div class="flex-container">
      <img src="${item.image?.medium}" alt="">
      <br>
      <div class="summary">${item?.summary}</div>
      <p> Runtime: ${item?.runtime}
      <br> Genre: ${item?.genres}
      <br> Status: ${item?.status}
      <br> Rating: ${item?.rating?.average}
      <br>
      <a class="url" href=${item?.url}>Check the source</a></p>
      </div>
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
    searchForEpisodes.innerHTML = `${filteredEpisodes.length}/${episodeList.length} results found.`; //the number of search results.
    makePageForEpisodes(filteredEpisodes);
    makePageForShows(showList);
  });
}

// drop down bar episodes
function dropDown(arr) {
  let drops = `<option value='1' >See all episodes</option>`;
  arr.forEach((item) => {
    drops += `<option value="${item.id}"> 
      S${item.season.toString().padStart(2, 0)}
      E${item.number.toString().padStart(2, 0)}
      ${item.name}</option>`;
  });
  episodeDropBar.innerHTML = "";
  episodeDropBar.insertAdjacentHTML("afterbegin", drops);
}

function selectMenu(episodeList) {
  episodeDropBar.addEventListener("change", (e) => {
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

//dropdown for shows
function dropDown2(arr) {
  let drops = `<option value='1'>See all shows</option>`;
  arr.forEach((item) => {
    drops += `<option value="${item.id}"> 
      ${item.name}</option>`;
  });
  showDropBar.innerHTML = "";
  showDropBar.insertAdjacentHTML("afterbegin", drops);
}

function selectMenu2(showList) {
  showDropBar.addEventListener("change", (candle) => {
    candle.preventDefault();
    const searching = +candle.target.value;
    let filteredLists = [];
    if (searching === 1) {
      rootElem.innerHTML = "";
      makePageForShows(showList);
      filteredLists = showList.name;
      return "";
    } else {
      filteredLists = showList.filter((show) => {
        return show.id === searching;
      });
    }
    rootElem.innerHTML = "";
    if (candle.target.value != 1) {
      getFetch(filteredLists[0].id);
    }
  });
}

window.onload = setup;
