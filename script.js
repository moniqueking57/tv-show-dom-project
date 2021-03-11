const searchBox = document.getElementById("livesearchShows");
const searchBoxEp = document.getElementById("livesearchEpisodes");
const searchForEpisodes = document.getElementById("span");
const rootElem = document.getElementById("root");
const showDropBar = document.getElementById("showBar");
const episodeDropBar = document.getElementById("episodeBar");
const xp = document.getElementById("search");
xp.appendChild(searchForEpisodes);

let fetchedEpisodes;

function setup() {
  // eslint-disable-next-line no-undef
  let showList = getAllShows();
  showList.sort(function (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
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
  searchFunction2(showList);
}

function getFetch(showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((episodes) => {
      return episodes.json();
    })
    .then((data) => {
      fetchedEpisodes = data;
      console.log(data);
      makePageForEpisodes(data);
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
      `<div id='episode' class="episode">
      <h2 id="titleH2" data-value=${item?.id}>${item?.name}</h2><div>
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
  const clickBtn = document.getElementById("episode").parentElement;
  clickBtn.addEventListener("click", (e) => {
    if (!e.target.dataset.value) return;
    const episodeList2 =
      episodeList.length !== 1 ? episodeList : fetchedEpisodes;
    console.log(episodeList2);
    console.log(e.target.dataset.value);
    const query = e.target.dataset.value;
    const episode = episodeList2.filter((item) => item.id === +query);
    console.log(episode);
    clickBtn.innerHTML = "";
    makePageForEpisodes([episode[0]]);
  });
}

function makePageForShows(showList) {
  console.log(showList);
  showList.forEach((item) => {
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<div id="hideInfo" style="display:block">
      <h2>${item?.name}</h2><div>
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
      <button  class="btn" id="episode-btn" style="flex">View episodes</button>
      </div>
      </div>
    </div>`
    );
    const clickBtn = document.getElementById("episode-btn");
    clickBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(item);
      fetch(`https://api.tvmaze.com/shows/${item.id}/episodes`)
        .then((episodes) => {
          return episodes.json();
        })
        .then((data) => {
          fetchedEpisodes = data;
          makePageForEpisodes(data);
          // rootElem.style.display = "none";
          console.log("x", data);
        });
    });
  });
}

//creates search box and functionality for episodes
function searchFunction(episodeList) {
  searchBoxEp.addEventListener("input", (e) => {
    e.preventDefault();
    const searchString = e.target.value.toLowerCase();
    let filteredEpisodes = episodeList.filter((epis) => {
      return (
        epis.name.toLowerCase().includes(searchString) ||
        epis.summary.toLowerCase().includes(searchString)
      );
    });
    rootElem.innerHTML = "";
    searchForEpisodes.innerHTML = `${filteredEpisodes.length}/${episodeList.length} results found.`;
    makePageForEpisodes(filteredEpisodes);
  });
}
//creates search box and functionality for shows
function searchFunction2(showList) {
  searchBox.addEventListener("input", (r) => {
    r.preventDefault();
    const searchString2 = r.target.value.toLowerCase();
    let filteredShows = showList.filter((epis) => {
      return (
        epis.name.toLowerCase().includes(searchString2) ||
        epis.summary.toLowerCase().includes(searchString2)
      );
    });
    rootElem.innerHTML = "";
    searchForEpisodes.innerHTML = `${filteredShows.length}/${filteredShows.length} results found.`;
    makePageForShows(filteredShows);
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
  showDropBar.addEventListener("change", (e) => {
    searchBoxEp.classList.remove("hiddenClass");
    e.preventDefault();
    const searching = +e.target.value;
    let filteredLists = [];
    if (searching === 1) {
      console.log("===");
      rootElem.innerHTML = "";
      console.log(showList);
      makePageForShows(showList);
      filteredLists = showList.name;
      return "";
    } else {
      filteredLists = showList.filter((show) => {
        return show.id === searching;
      });
    }
    rootElem.innerHTML = "";
    if (e.target.value !== 1) {
      console.log("!==");
      console.log(filteredLists);
      getFetch(filteredLists[0].id);
    }
  });
}

window.onload = setup;
