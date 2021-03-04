const searchBox = document.getElementById("livesearch");
const pancakes = document.createElement("span");
const rootElem = document.getElementById("root");
const showDropBar = document.getElementById("tart");
const clive = document.getElementById("pie");
const xp = document.getElementById("chocolatePancakes");
xp.appendChild(pancakes);

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
    .catch((err) => console.log("err", err));
}

function makePageForEpisodes(episodeList) {
  episodeList.forEach((item) => {
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<div class="episode">
      <h2>${item?.name}</h2><div>
      <img src="${item.image?.medium}" alt="">
      <br>
      ${item?.summary}
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
      `<div class="shows">
      <h2>${item?.name}</h2><div>
      <img src="${item.image?.medium}" alt="">
      <br>
      ${item?.summary}
      <p> Runtime: ${item?.runtime}</p>
      <p> Genre: ${item?.genres}</p>
      <p> Status: ${item?.status}</p>
      <p> Rating: ${item?.rating?.average}</p>
      <br>
      <a class="url" href=${item?.url}>Check the source</a>
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
    makePageForShows(filteredEpisodes);
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
