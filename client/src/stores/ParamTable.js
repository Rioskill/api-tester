import { action, computed, makeObservable, observable } from "mobx";
export class ParamTable {
    constructor() {
        this.params = [];
        makeObservable(this, {
            params: observable,
            setKey: action,
            setValue: action,
            lastValueIsEditable: computed,
            lastId: computed,
        });
    }
    setKey(id, key) {
        if (id === this.params.length) {
            this.params.push({
                key: '',
                value: ''
            });
        }
        this.params[id].key = key;
        this.checkRow(id);
    }
    setValue(id, value) {
        this.params[id].value = value;
        this.checkRow(id);
    }
    checkRow(id) {
        if (this.params[id].key === '' && this.params[id].value === '') {
            this.removeRow(id);
        }
    }
    removeRow(id) {
        this.removeKey(id);
        this.removeValue(id);
    }
    removeKey(id) {
        delete this.params[id];
    }
    removeValue(id) {
        delete this.params[id];
    }
    get emptyRowsCnt() {
        if (this.params.length < 3) {
            return 3 - this.params.length;
        }
        const lastId = this.params.length - 1;
        const lastParam = this.params[lastId];
        // if (lastParam.key !== '' && lastParam.value === '') {
        //     return 0;
        // }
        return 1;
    }
    get lastValueIsEditable() {
        if (this.params.length === 0) {
            return false;
        }
        const lastId = this.params.length - 1;
        const lastParam = this.params[lastId];
        return lastParam.key !== ''; // && lastParam.value === '';
    }
    get length() {
        return this.params.length;
    }
    get lastId() {
        if (this.params.length === 0) {
            return 0;
        }
        return this.params.length;
    }
    valueIsEditable(id) {
        if (this.params.length <= id) {
            return false;
        }
        return this.params[id].key != '';
    }
}
