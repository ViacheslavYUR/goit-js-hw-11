import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import _debounce from 'lodash.debounce';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_URL = '32167843-8e8cdf0804a85ffadb96a7b65';

const refs = {
  input: document.querySelector('.search-form').searchQuery,
  form: document.querySelector('.search-form'),

  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearh);
refs.input.addEventListener('input', _debounce(onInputSearch, 300));
refs.loadMore.addEventListener('click', LoadMore);

let searchText = '';
let markUpCards = [];
let page = 1;

console.log(searchText);

async function getFetch() {
  const getsearch = await fetch(
    `https://pixabay.com/api/?key=${KEY_URL}&q=${searchText}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
  );
  const responece = await getsearch.json();
  console.log(responece);
  return responece;
}

function onInputSearch(e) {
  searchText = e.target.value;
  console.log(e.target.value);
  console.log(searchText);
}

async function LoadMore() {
  page += 1;
  const data = await getFetch();
  render(data);
}

async function onSearh(e) {
  e.preventDefault();
  page = 1;
  clearRender();
  const data = await getFetch();
  render(data);
  refs.input.value = '';
  searchText = '';
}

function render({ hits }) {
  //   console.dir(hits);
  const listMarkup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  //   console.dir(listMarkup);
  refs.gallery.insertAdjacentHTML('beforeend', listMarkup);
}
function clearRender() {
  refs.gallery.innerHTML = '';
}
