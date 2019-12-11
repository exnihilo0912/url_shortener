import styles from './styles.scss'
import StateMachine from "./StateMachine";
import ClipboardJS from 'clipboard';

const link_root = 'https://rel.ink/';
const input = document.querySelector('input[type="url"]');
const form = document.querySelector('form.form');
const card_container = document.querySelector('.card-container');

//TODO dropdown menu
//TODO copied change state
(function () {
    const UI = new StateMachine(card_container, 'https://rel.ink/api/links/', link_root);
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

    form.addEventListener('submit', e => {
        e.preventDefault();
        UI.dispatch('click', 'input[type="url"]');
    });
}());