import { action, computed, makeObservable, observable } from "mobx";

export type Param = {
    key: string,
    value: string
}

export class ParamTable {
    params: Param[] = []

    constructor() {
        makeObservable(this, {
            params: observable,
            setKey: action,
            setValue: action,
            lastValueIsEditable: computed,
            lastId: computed,
        });
    }

    setKey(id: number, key: string) {
        if (id === this.params.length) {
            this.params.push({
                key: '',
                value: ''
            })
        }
        this.params[id].key = key;
        this.checkRow(id);
    }

    setValue(id: number, value: string) {
        this.params[id].value = value;
        this.checkRow(id);
    }

    checkRow(id: number) {
        if (this.params[id].key === '' && this.params[id].value === '') {
            this.removeRow(id);
        }
    }

    removeRow(id: number) {
        this.removeKey(id);
        this.removeValue(id);
    }

    removeKey(id: number) {
        delete this.params[id];
    }

    removeValue(id: number) {
        delete this.params[id];
    }

    get emptyRowsCnt() {
        if (this.params.length < 3) {
            return 3 - this.params.length; 
        }

        const lastId = this.params.length - 1;
        const lastParam = this.params[lastId]

        if (lastParam.key !== '' && lastParam.value === '') {
            return 0;
        }

        return 1;
    }

    get lastValueIsEditable() {
        if (this.params.length === 0) {
            return false;
        }
        const lastId = this.params.length - 1;
        const lastParam = this.params[lastId]
        return lastParam.key !== '' && lastParam.value === '';
    }

    get lastId() {
        if (this.params.length === 0) {
            return 0;
        }
        if (this.lastValueIsEditable) {
            return this.params.length - 1;
        }
        return this.params.length;
    }
}