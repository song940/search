import { ready, querySelector as $ } from 'https://lsong.org/scripts/dom.js';
import { query } from 'https://lsong.org/scripts/query.js';
import { h, render, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js';

ready(async () => {

  const { q: keyword } = query;
  console.log('keyword:', keyword);

  const root = document.body;
  const searchbox = $('#searchbox');

  root.className = keyword ? 'result' : 'initial';

  if (!keyword) return;

  searchbox.value = keyword;
  document.title = `${keyword} - WebSearch`;

  const data = await search(keyword);

  console.log('results:', data);
  render(h(SearchResult, { data }), $('#results'));
});

const SearchResult = ({ data }) => {
  const { total, hits } = data;
  return h('div', { className: 'search-result' }, [
    h('p', { className: 'search-result-total' }, `About ${total.value} results`),
    h('ul', { className: 'search-result-list' }, hits.map(hit => h('li', null, h(SearchResultItem, hit))))
  ]);
};

const SearchResultItem = ({ _score, _source }) => {
  const { title, description, url } = _source;
  return h('div', { className: 'search-result-item' }, [
    h('a', { href: url }, h('h2', null, title)),
    h('a', { href: url, className: 'search-result-item-link' }, url),
    h('p', null, description),
    h('p', { className: 'search-result-item-score' }, `score: ${parseFloat(_score * 100).toFixed(2)}%`)
  ])
};

const search = async keyword => {
  const query = {
    match: { description: keyword }
  };
  const response = await fetch(`https://elasticsearch.lsong.me/websearch/pages/_search`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  const result = await response.json();
  return result.hits;
};