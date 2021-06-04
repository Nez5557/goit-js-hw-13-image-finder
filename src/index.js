import './sass/main.scss';
import cardTmpl from './templates/cardTmpl.hbs';
import PicApiService from './js/apiService';
import LoadMoreBtn from './js/load-more-btn';
import getRefs from './js/get-refs';

const refs = getRefs();
const picApiService = new PicApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.js-load-btn',
    hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch)
loadMoreBtn.btn.addEventListener('click', onLoadMore)

function onSearch(e) {
    e.preventDefault();
    picApiService.query = e.currentTarget.elements.query.value.trim();
    if (picApiService.query === '') {
        return alert('Query can not be empty');
    }
    picApiService.resetPage();
    picApiService
        .fetchPic()
        .then((hits) => {
if (hits.length === 0) { return alert('Sorry, enter correct query') };
            if (hits.length !== 0) {
                loadMoreBtn.show();
            }
            clearGallery();
            renderPicMarkup(hits);
            if (hits.length < 12) {
                loadMoreBtn.hide();
            }
        })
        .catch((error) => console.log(error));
}

function onLoadMore() {
    picApiService.fetchPic().then(renderPicMarkup);
}

function renderPicMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', cardTmpl(hits));
        refs.gallery.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
});
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}