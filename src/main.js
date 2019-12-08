import styles from './styles.scss'
import StateMachine from "./StateMachine";

const link_root = 'https://rel.ink';
const input = document.querySelector('input[type="url"]');
const form = document.querySelector('form.form');
const card_container = document.querySelector('.card-container');

(function () {
    const UI = new StateMachine(card_container);
    if(!form) {
        return;
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        UI.dispatch('click', 'input[type="url"]');
    })

}());