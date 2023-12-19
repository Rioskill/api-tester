import { db_pool } from "./db_config";

class DBController {
    async transform_params (params: {name: string, value: string}[]) {
        if (params === undefined) {
            return [];
        }
        return params.map(({name, value}) => ({key: name, value}))
    }

    construct_params (test_id: number, params: {key: string, value: string}[]) {
        return params.map(({key, value}) => `(${test_id}, '${key}', '${value}')`).join(',')
    }

    async getParams(test_id: number) {
        try {
            const q = await db_pool.query("select name, value from testparam where test_id = $1", [test_id])
            return this.transform_params(q.rows)
        } catch(err) {
            console.log(err)
        }
    }

    async saveParam(test_id: number, name: string, value: string[]) {
        try {
            db_pool.query(`
            insert into TestParam
            (test_id, name, value)
            values ($1, $2, $3)}
        `, [test_id, name, value])
        } catch(err) {
            console.log(err)
        }
    }

    async deleteParam(test_id: number, name: string) {
        try {
            db_pool.query(`
            delete from TestParam
            where test_id = $1 and name = $2
        `, [test_id, name])
        } catch(err) {
            console.log(err)
        }
    }

    async deleteParams(test_id: number) {
        try {
            db_pool.query(`
            delete from TestParam
            where test_id = $1
        `, [test_id])
        } catch(err) {
            console.log(err)
        }  
    }

    async saveParams(test_id: number, params: any[]) {
        if (params === undefined || params.length === 0) {
            return;
        }

        db_pool.query(`
            insert into TestParam
            (test_id, name, value)
            values ${this.construct_params(test_id, params)}
        `)
    }

    async getReports(test_id: number) {
        const res = await db_pool.query(`
            select id, response_body, status
            from TestReport
            where test_id = $1
        `, [test_id])

        
    }

    async getTests(group_id: number) {
        const res = await db_pool.query("select * from Test where group_id = $1", [group_id])

        const tests = res.rows

        const getParams = (tests: {id: number}[]) => {
            return tests.map(test => this.getParams(test.id))
        }

        const addParams = async (tests: {id: number}[]) => {
            const params = await Promise.all(getParams(tests));

            return  tests.map((test, i) => ({...test, params: params[i]}));
        }

        const tests_with_params = await addParams(tests)

        return tests_with_params;
    }

    async getGroups() {
        const res = await db_pool.query(`
            select * from testgroup
        `)

        const groups = res.rows;

        const getTests = (groups: {id: number}[]) => {
            return groups.map(group => this.getTests(group.id))
        }

        const addTests = async (groups: {id: number}[]) => {
            const tests = await Promise.all(getTests(groups));

            return groups.map((group, i) => ({...group, tests: tests[i]}))
        }

        const groups_with_tests = await addTests(groups);

        return groups_with_tests;
    }

    async createTest(test: any) {
        try {
            const test_id = await db_pool.query(`
                insert into Test 
                (name, method, target_url, request_body, expected_response_body, expected_status, group_id)
                values
                ($1, $2, $3, $4, $5, $6, $7)
                returning id
                `, 
            [test.name, test.method, test.target_url, test.request_body, test.response_body, test.status, test.group_id])

            this.saveParams(test.id, test.params);

            return test_id;
        } catch(err) {
            console.log(err)
        }
    }

    async createTestWithName(group_id: number, test_name: number) {
        return this.createTest({
            name: test_name,
            method: 'GET',
            target_url: '',
            request_body: '',
            response_body: '',
            status: 200,
            group_id: group_id
        })
    }

    async updateTest(test: any) {
        try {
            await db_pool.query(`
                update test
                set
                    name = $1,
                    method = $2,
                    target_url = $3,
                    request_body = $4,
                    expected_response_body = $5,
                    expected_status = $6
                where id = $7
                `,
            [test.name, test.method, test.target_url, test.request_body, test.response_body, test.status, test.id])

            this.deleteParams(test.id);
            this.saveParams(test.id, test.params);
        } catch(err) {
            console.log(err)
        }
    }

    async deleteTest(test_id: number) {
        try {
            await db_pool.query(`
                delete from test
                where id = $1
            `, [test_id])
        } catch(err) {
            console.log(err);
        }
    }

    async createGroup(group_name: string) {
        try {
            return await db_pool.query(`
                insert into testgroup (name) values ($1)
                returning id;
            `, [group_name]);
        } catch(err) {
            console.log(err);
        }
    }

    async updateGroupName(group_id: number, group_name: string) {
        try {
            return await db_pool.query(`
                update testgroup set name = $1
                where id = $2
            `, [group_name, group_id]);
        } catch(err) {
            console.log(err);
        }
    }

    async deleteGroup(group_id: number) {
        try {
            await db_pool.query(`
                delete from testgroup where id = $1
            `, [group_id]);
        } catch(err) {
            console.log(err);
        }
    }


}

export const db_controller = new DBController()
