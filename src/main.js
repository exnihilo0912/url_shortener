import styles from './styles.scss'
import StateMachine from "./StateMachine";
import ClipboardJS from 'clipboard';

const api_url = 'https://rel.ink/api/links/';
const url_prefix = 'https://rel.ink/';
const form = document.querySelector('form.form');
const card_container = document.querySelector('.card-container');
const dropdown = document.querySelector('.dropdown');

//Storage keys
const storage = window.localStorage;
const storage_keys = {link: 'links'};
//TODO dropdown menu
(function () {
    const UI = new StateMachine(card_container, api_url, url_prefix);
    UI.initStorage(storage, storage_keys);
    UI.initLinks();

    if(!form) {
        return;
    }

    const clipboard = new ClipboardJS('.btn-copy');

    // copy button clicked
    clipboard.on('success', function(e) {
        e.trigger.classList.add('btn--used');
        e.trigger.innerHTML = 'Copied!';

        e.clearSelection();
    });

    // Register state machine as a Observer
    form.addEventListener('submit', e => {
        e.preventDefault();
        UI.dispatch('click', 'input[type="url"]');
    });

    // dropdown
    dropdown.addEventListener('click', e => {
       let elem = e.target;
       let target = document.querySelector(elem.dataset.target);

       if(target.classList.contains('open')) {
           target.classList.remove('open');
       } else {
           target.classList.add('open');
       }
    });
}());