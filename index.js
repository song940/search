import { ready, querySelector as $ } from 'https://lsong.org/scripts/dom.js';
import { query } from 'https://lsong.org/scripts/query.js';

ready(async () => {

  const { q: keyword } = query;
  console.log('keyword:', keyword);

  const root = document.body;
  const searchbox = $('#searchbox');

  root.className = keyword ? 'result' : 'initial';

  if (!keyword) return;

  searchbox.value = keyword;

  const result = await search(keyword);
  console.log(result);

});

const search = async () => {
  const response = await fetch(`https://elasticsearch.lsong.me/websearch/pages/_search`);
  const result = await response.text();
  return result;
};