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
            paramInput: computed
        });
    }

    get paramInput() {
        const res = []

        this.params.forEach(param => res.push({
            key: param.key,
            value: param.value,
            key_editable: false,
            value_editable: false
        }))

        for (let i = 0; i < Math.max(3 - this.params.length, 1); i++) {
            res.push({
                key: '',
                value: '',
                key_editable: false,
                value_editable: false
            })
        }

        let cnt = 0;
        for (let i = 0; i <  res.length; i++) {
            let elem = res[i];
            if (elem.key !== '') {
                cnt++;
                elem.key_editable = true;
                elem.value_editable = true;
            } else if (i > 0 && res[i - 1].value !== '') {
                elem.key_editable = true;
            }
        }

        if (cnt === 0) {
            res[0].key_editable = true;
        }

        return res;
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

    get length() {
        return this.params.length;
    }
}