const state = {
  totalBudget: [],
  editTarget: [],
};

class Events {
  #budgetTotal = document.querySelector('.budget-total');
  #inpValueName = document.querySelector('.inp-expense-name');
  #inpValueCost = document.querySelector('.inp-expense-cost');
  #btnAdd = document.querySelector('.btn-add');

  constructor() {
    this._clickEvent();
    this._disabled();
  }

  _clickEvent() {
    // this.#btnAdd.addEventListener('click', this._saveItem.bind(this));
    this.#btnAdd.addEventListener('click', () => {
      if (this.#btnAdd.innerHTML === 'Save changes') this._saveChanges();
      if (this.#btnAdd.innerHTML === 'Add expense') this._saveItem();
    });

    const btnBudget = document.querySelector('.btn-budget');
    btnBudget.addEventListener('click', this._setBudget.bind(this));

    const budgetList = document.querySelector('.budget__list');
    // budgetList.addEventListener('click', this._deleteItem.bind(this));
    budgetList.addEventListener('click', this._clickHandler.bind(this));
  }

  _setBudget() {
    const inpBudget = parseFloat(document.querySelector('.inp-budget').value);

    if (!inpBudget) return;
    state.totalBudget = +state.totalBudget + +inpBudget;
    this.#budgetTotal.innerHTML = `${state.totalBudget}$`;
    view._clear();

    this.#inpValueName.disabled = false;
    this.#inpValueCost.disabled = false;
    this.#btnAdd.disabled = false;
    this.#btnAdd.classList.add('button');
  }

  _saveItem() {
    const inpValueName = this.#inpValueName.value;
    const inpValueCost = this.#inpValueCost.value;
    if (!inpValueCost || !inpValueName) return;
    if (parseFloat(inpValueCost) > state.totalBudget) {
      alert(`You do not have enought money to buy this ${inpValueName} :(`);
      view._clear();
      return;
    } else view._renderItem(inpValueName, inpValueCost);
  }

  _deleteItem(click) {
    const parent = click.closest('.budget__list');
    const target = click.closest('.budget__list-item');

    const add = target.querySelector('.budget__list-cost').innerHTML;
    this._updateBudget(add);
    parent.removeChild(target);
  }

  _editItem(click) {
    this.#btnAdd.innerHTML = `Save changes`;

    const target = click.closest('.budget__list-item');
    const name = target.querySelector('.budget__list-title').innerHTML;
    const cost = target.querySelector('.budget__list-cost').innerHTML;

    this.#inpValueName.value = name;
    this.#inpValueCost.value = cost;

    // name = this.#inpValueName.value;
    // cost = this.#inpValueCost.value;
    // this._saveChanges(target);
    state.editTarget = target;
    // this._deleteItem(click);
  }

  _saveChanges() {
    const id = state.editTarget.dataset.id;
    const budgetListItem = document.querySelectorAll('.budget__list-item');
    budgetListItem.forEach((item) => {
      if (item.dataset.id === id) {
        let name = item.querySelector('.budget__list-title');
        let cost = item.querySelector('.budget__list-cost');

        state.totalBudget += +cost.innerHTML;

        name.innerHTML = this.#inpValueName.value;
        cost.innerHTML = +this.#inpValueCost.value;

        let add = this.#inpValueCost.value;

        if (cost > add) {
          add = +cost - +add;
          console.log(add);
          this._updateBudget(add);
        } else this._updateBudget();

        this.#btnAdd.innerHTML = 'Add expense';
        // this._updateBudget();
        view._clear();
      }
    });
  }

  _clickHandler(e) {
    const click = e.target;
    if (click.classList.contains('btn-delete')) this._deleteItem(click);
    if (click.classList.contains('btn-edit')) this._editItem(click);
  }

  _updateBudget(add) {
    if (!add) {
      const expense = document.querySelector('.budget__list-cost').innerHTML;
      state.totalBudget -= +expense;
      this.#budgetTotal.innerHTML = `${state.totalBudget}$`;
    } else {
      state.totalBudget += +add;
      this.#budgetTotal.innerHTML = `${state.totalBudget}$`;
    }
  }

  _disabled() {
    if (this.#budgetTotal.innerHTML === '') {
      this.#inpValueName.disabled = true;
      this.#inpValueCost.disabled = true;
      this.#btnAdd.disabled = true;
      this.#btnAdd.classList.remove('button');
    }
  }

  _makeID() {
    return new Date().getTime().toString();
  }
}

class View {
  _takeTime() {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDate();

    return [hour, day];
  }

  _renderItem(inpValueName, inpValueCost) {
    const budgetList = document.querySelector('.budget__list');

    const time = this._takeTime();
    const [hour, day] = time;
    const id = events._makeID();
    const html = `
        <div class="budget__list-item" data-id="${id}">
            <div class="budget__list-details">
          <ol class="budget__list-details">
            <ul>
            <li>Name:</li>
            <li class="detail budget__list-title">${inpValueName}</li>
            </ul>
            <ul>
            <li>Cost:</li>
            <li class="detail budget__list-cost">${inpValueCost}</li>
            </ul>
            <ul>
            <li>Time:</li>
            <li class="detail budget__list-time">${day}, ${hour}</li>
            </ul>
          </ol>
            </div>
            <div class="btns">
              <button class="btn btn-delete">Delete</button>
              <button class="btn btn-edit">Edit</button>
            </div>
          </div>`;
    budgetList.insertAdjacentHTML('afterbegin', html);
    events._updateBudget();
    this._clear();
  }

  _clear() {
    const inpValueName = document.querySelector('.inp-expense-name');
    const inpValueCost = document.querySelector('.inp-expense-cost');
    const inpBudget = document.querySelector('.inp-budget');

    inpValueName.value = '';
    inpValueCost.value = '';
    inpBudget.value = '';
  }
}

const events = new Events();
const view = new View();
