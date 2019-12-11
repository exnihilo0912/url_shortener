import styles from './styles.scss'
import StateMachine from "./StateMachine";
import ClipboardJS from 'clipboard';

const link_root = 'https://rel.ink/';
const input = document.querySelector('input[type="url"]');
const form = document.querySelector('form.form');
const card_container = document.querySelector('.card-container');

//TODO dropdown menu
(function () {
    const UI = new StateMachine(card_container, 'https://rel.ink/api/links/', link_root);
    if(!form) {
        return;
    }
    const clipboard = new ClipboardJS('.btn-copy');
    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        UI.dispatch('click', 'input[type="url"]');
    })

}());