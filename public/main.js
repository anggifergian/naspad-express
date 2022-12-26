const inboxPeople = document.querySelector('.inbox__people');
const inputField = document.querySelector('.message_form__input');
const messageForm = document.querySelector('.message_form');
const messageBox = document.querySelector('.messages__history');
const fallback = document.querySelector('.fallback');
const btnSubmit = document.querySelector('.message_form__button');

document.addEventListener('DOMContentLoaded', () => {
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
    })
});