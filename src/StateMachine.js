export default class StateMachine {
    constructor(container) {
        this.container = container;
        this.current_state = 'idle';
        this.states = {
            'idle': {
                click: (selector) => {
                    this.changeState('checking');
                    if(document.querySelector(`${selector}:invalid`)) {
                        this.dispatch('failure', {selector, message: 'Please add a link'});
                    } else {
                        this.dispatch('success');
                    }
                },
            },
            'fetching': {
                success: (data) => {
                    this.changeState('result');
                    this.dispatch('display', data)
                },
                failure: (payload) => {
                    this.changeState('error');
                    this.dispatch('display', payload);

                }
            },
            'checking': {
                //TODO yarn add axios
                success: () => {
                    this.changeState('fetching');
                    //perform api call
                    this.dispatch('success', {title: 'test', caption: 'test card'})
                },
                failure: (selector) => {
                    this.changeState('error');
                    this.dispatch('display',{selector, message: 'link creation failed'})
                }
            },
            'error': {
                display: ({selector, message}) => {
                    this.changeState('idle');
                    //display error message on selector
                }
            },
            'result': {
                display: ({title, caption}) => {
                    this.changeState('idle');
                    //add card with data
                    this.container && this.container.insertAdjacentHTML('beforeend',StateMachine.make_card(title, caption))

                }
            }
        }
    }

    dispatch(action, payload) {
        const actions = this.states[this.current_state];
        actions[action] && actions[action](payload);
    }

    changeState(new_state) {
        console.log('changing state: ' + new_state);
        if(this.states[new_state]) {
            this.current_state = new_state;
        }
    }

    static make_card(title, caption) {
        return `
            <article class="card">
                <h4 class="card__title">${title}</h4>
                <div class="card__content">
                  <p class="card__caption">${caption}</p>
                  <button class="btn btn--big btn--soft-corner">Copy</button>
                </div>
            </article>
        `;
    }
}