const appId = '4fc2d3f00b8658b4866618bac07a96c3483305a1';
const baseUrl = 'http://api.e-stat.go.jp/rest/2.1/app/json/';

function buildSearchUrl (keyword) {
  const getStatsListUrl = `${baseUrl}getStatsList?appId=${appId}&statsCode=${keyword}`;
  return getStatsListUrl;
}
function buildGetStatsUrl(statsId) {
  const getStatsListUrl = `${baseUrl}getStatsData?appId=${appId}&statsDataId=${statsId}`;
  return getStatsListUrl;
}
function searchFromStatsCode (keyword) {
  return fetch(buildSearchUrl(keyword), { mode: 'cors' })
    .then(response => response.json())
    .then(result => result.GET_STATS_LIST.DATALIST_INF.TABLE_INF);
}
function getStatsData (statsId) {
  return fetch(buildGetStatsUrl(statsId), {mode: 'cors' })
    .then(response => response.json())
    .then(result => result.GET_STATS_DATA);
}

const searchButton = document.querySelector('.js-search-btn');
const statsCodeInput = document.querySelector('.js-search-code');
searchButton.addEventListener('click', () => {
  const statsCode = statsCodeInput.value;
  searchFromStatsCode(statsCode)
    .then(mapTableDataForShowing)
    .then(showSearchResult);
});

function mapTableDataForShowing (data) {
  return data.map(x => ({
    statsId: x['@id'],
    name: x.STATISTICS_NAME,
    title: x.TITLE.$,
    recordCount: x.OVERALL_TOTAL_NUMBER,
    updatedDate: x.UPDATED_DATE
  }));
}

function showSearchResult (data) {
  // 結果を js-search-result の下に書き込む
  const searchResultArea = document.querySelector('.js-search-result');
  data.forEach(x => {
    const li = document.createElement('LI');
    li.classList.add('stats-list');
    li.dataset.statsId = x.statsId;
    li.innerHTML = `
                    <p class="stat-name">${x.name}</p>
                    <p class="stat-title">${x.title}</p>
                    <p class="record-count">${x.recordCount}</p>
                    <p class="updated-date">${x.updatedDate}</p>
                    <button class="js-get-data-btn">データ取得</button>
`;
    const button = li.querySelector('.js-get-data-btn');
    button.addEventListener('click', () => {
      getStatsData(x.statsId)
        .then(mapStatsDataForShowing)
    });
    searchResultArea.appendChild(li);
  });
}

function mapStatsDataForShowing(data) {
console.log(data);
  // 耕地面積・収入・個人or法人のデータってなくない？
  // 適当に生成?
  // return data.map
}

function drawScatterMap() {
  const dataset = [
    { area: 10, income: 100, isCompany: false },
    { area: 20, income: 200, isCompany: true }
  ];
  const graph = d3
    .select('body')
    .append('svg')
    .attr({ width: '300px', height: '300px' });
  graph
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle');
}
