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
    }

    setValue(id: number, value: string) {
        this.params[id].value = value;
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