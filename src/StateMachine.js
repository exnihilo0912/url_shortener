import axios from 'axios';

export default class StateMachine {
    constructor(container, api_url, base_url) {
        this.url = api_url;
        this.storage = this.storage_keys = null;
        this.base_url = base_url;
        this.container = container;
        this.current_state = 'idle';
        this.states = {
            'idle': {
                click: (selector) => {
                    this.changeState('checking');
                    let invalid = document.querySelector(`${selector}:invalid`)
                    if(invalid || !document.querySelector(selector).value) {
                        this.dispatch('failure', {selector, message: invalid ? 'Not a valid url' : 'Please add a link'});
                    } else {
                        let input = document.querySelector(`${selector}`);
                        let input_error = document.querySelector(`${selector} ~ .input-group__error`);
                        if(input_error.classList.contains('invalid')) {
                            input_error.classList.remove('invalid');
                        }
                        this.loading(true);
                        this.dispatch('success', {url: input.value, selector});
                    }
                },
            },
            'fetching': {
                success: (data) => {
                    this.changeState('result');
                    this.dispatch('display', data)
                },
                failure: ({selector}) => {
                    this.changeState('error');
                    this.dispatch('display', {selector, message: 'Link creation failed'});
                }
            },
            'checking': {
                success: ({url, selector}) => {
                    this.changeState('fetching');
                    axios.post(this.url, {url}).then( ({data}) => {
                        this.dispatch('success', {title: data.url, caption: this.base_url + data.hashid})
                    }).catch( err => {
                        this.dispatch('failure', {selector})
                    }).finally(e => {
                        this.loading(false);
                    });

                },
                failure: ({selector, message}) => {
                    this.changeState('error');
                    this.dispatch('display',{selector, message})
                }
            },
            'error': {
                display: ({selector, message}) => {
                    this.changeState('idle');

                    let input_error = document.querySelector(`${selector} ~ .input-group__error`);
                    input_error.innerHTML = message;
                    input_error.classList.add('invalid')
                }
            },
            'result': {
                display: ({title, caption}) => {
                    this.changeState('idle');
                    this.container && this.container.insertAdjacentHTML('beforeend',StateMachine.make_card(title, caption));
                    this.container && this.addToStorage(this.updateData(this.getFromStorage(this.storage_keys['link'], []), {title, caption}))
                }
            }
        }
    }

    dispatch(action, payload) {
        const actions = this.states[this.current_state];
        actions[action] && actions[action](payload);
    }

    changeState(new_state) {
        if(this.states[new_state]) {
            this.current_state = new_state;
        }
    }

    loading(mode) {
        let loading = document.querySelector('.loading');

        if(mode)
            loading.classList.add('on');
        else
            loading.classList.remove('on');

    }

    updateData(data, new_data) {
        if(data instanceof Array)
            data.push(new_data);
        else {
            Object.assign(data, new_data);
        }
        return {key: this.storage_keys['link'], value: data};
    }

    initLinks() {
        let links = this.getFromStorage(this.storage_keys['link']);

        if(links) {
            links.forEach(link => {
                this.container &&
                this.container.insertAdjacentHTML('beforeend',StateMachine.make_card(link.title, link.caption));
            })
        }
    }

    initStorage(storage, storage_keys) {
        if(storage && storage_keys) {
            this.storage = storage;
            this.storage_keys = storage_keys;
        }
    }

    // Abstract localStorage / Session storage & value check
    addToStorage({key, value}) {
        if(!this.storage || !key || !value)
            return;
        this.storage.setItem(key, JSON.stringify(value));
    }

    getFromStorage(key, _default) {
        if(!this.storage || !key)
            return;
        return JSON.parse(this.storage.getItem(key)) || _default;
    }

    static make_card(title, caption) {
        return `
            <article class="card">
                <h4 class="card__title">${title}</h4>
                <div class="card__content">
                  <input id="test" class="card__caption" value="${caption}" readonly />
                  <button class="btn btn--big btn--soft-corner btn-copy" data-clipboard-target="#test">Copy</button>
                </div>
            </article>
        `;
    }
}