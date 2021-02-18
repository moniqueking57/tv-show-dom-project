const searchBox = document.getElementById("livesearch");
// eslint-disable-next-line no-undef
const allEpisodes = getAllEpisodes();
const pancakes = document.createElement("span");
const xp = document.getElementById("chocolatePancakes");
xp.appendChild(pancakes);
const rootElem = document.getElementById("root");

function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  episodeList.forEach((item) => {
    //  console.log(item);
    rootElem.insertAdjacentHTML(
      "afterbegin",
      `<div class="episode">
                            <h2>${item.name}</h2><div>
                            <img src="${item.image.medium}" alt="">
                            <br>
                            ${item.summary}
                            S${item.season
                              .toString()
                              .padStart(
                                2,
                                0
                              )}E${item.number.toString().padStart(2, 0)}
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
    // console.log(e.target)
    const searchString = e.target.value.toLowerCase();
    // console.log(`coolee ${e.target.value}`)
    let filteredEpisodes = episodeList.filter((epis) => {
      return (
        epis.name.toLowerCase().includes(searchString) ||
        epis.summary.toLowerCase().includes(searchString)
      );
    });
    rootElem.innerHTML = "";
    //the number of search results.
    // pancakes.innerHTML = filteredEpisodes.length;
    pancakes.innerHTML = `${filteredEpisodes.length}/${episodeList.length} results found.`;
    //end the number of search results.

    makePageForEpisodes(filteredEpisodes);
  });
}

// eslint-disable-next-line no-undef
searchFunction(allEpisodes);

window.onload = setup;
