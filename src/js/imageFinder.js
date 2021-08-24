import template from '../templates/imageCard.hbs';
import { searchForm, input, ul, modalDiv, modalDivButton, modalImg, addPictures } from './refs';
import getPictures from '../helpers/apiService';

const state = {
  page: 1,
  query: '',
};

searchForm.addEventListener(`submit`, sendSubmit);
ul.addEventListener(`click`, opneModal);
addPictures.addEventListener(`click`, addNewPictures);
modalDiv.addEventListener(`click`, closeModalWindow);

const targets = document.getElementsByClassName('modal-img');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

const loadImage = function () {
  if (state.page > 1) {
    state.page += 1;
    getPictures(state.query, state.page).then(resp => {
      const data = resp.data.hits;
      const mark = template(data);
      ul.insertAdjacentHTML(`beforeend`, mark);
    });
  }
};

const observer = new IntersectionObserver(loadImage, options);

[...targets].forEach(target => {
  observer.observe(target);
});

function sendSubmit(e) {
  e.preventDefault();
  ul.innerHTML = ``;
  state.query = `&q=${input.value}`;
  addPictures.style.visibility = `hidden`;
  getPictures(state.query, state.page).then(response => {
    const data = response.data.hits;
    if (data.length >= 1) {
      addPictures.style.visibility = `visible`;
    }
    const markup = template(data);
    ul.insertAdjacentHTML(`beforeend`, markup);
  });
}

function addNewPictures() {
  state.page += 1;
  getPictures(state.query, state.page).then(resp => {
    const data = resp.data.hits;
    const mark = template(data);
    ul.insertAdjacentHTML(`beforeend`, mark);
  });
  addPictures.removeAttribute('style');
}

function opneModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  document.addEventListener(`keyup`, closeByEscape);
  modalDiv.setAttribute(`class`, `lightbox__overlay`);
  modalDivButton.setAttribute(`class`, `lightbox__button`);
  modalImg.setAttribute(`src`, `${e.target.src}`);
}

function closeByEscape(e) {
  if (e.key !== `Escape`) {
    return;
  }
  closeModalWindow();
}

function closeModalWindow(e) {
  if (e?.target === modalImg) {
    return;
  }
  document.removeEventListener(`keyup`, closeByEscape);
  modalDiv.setAttribute('class', '');
  modalDivButton.setAttribute('class', 'invisible');
  modalImg.setAttribute('src', '');
}
