import { observer } from "mobx-react-lite"
import { isEmpty, detectDiff, detectDiffR } from "../../../common/utils"
import { store } from "../stores/AppStore";

const request = {
    params: {
        a: 3,
        b: 3
    }
}

const notFoundreportData = {
    name: "not found report",
    url: "url",
    request: request,
    comparison_result: {
        status: {
            expected: 200,
            found: 404
        },
        body: {
            expected: {
                sum: 6
            },
            found: undefined
        },
        sum: 6
    }
}

const data = notFoundreportData;

type CellValue = string | number;
interface ComparisonTableCellProps {
    name: string;
    isCorrect: boolean;
    data: any
}
export const ComparisonTableCell = observer(({name, isCorrect, data}: ComparisonTableCellProps) => {
    return (
        <div className={"comparison-table__cell" + (isCorrect ? "" : " incorrect")}>
            <div className="comparison-table__cell-header">
                {name}
            </div>
            <div className="comparison-table__value-header">
                expected
            </div>
            <div className="comparison-table__value-header">
                found
            </div>

            <div className="comparison-table__value">
                <ReportNode data={data} type='expected'/>
            </div>
            <div className="comparison-table__value">
                <ReportNode data={data} type='found'/>
            </div>
        </div>
    )
})

const toString = (x: string | number | object | undefined) => {
    if (typeof x === 'string') {
        return x;
    }

    if (typeof x === 'number') {
        return x.toString();
    }

    if (x === undefined) {
        return '';
    }

    return JSON.stringify(x);
}

const isPrintable = (obj: any) => {
    return typeof data === 'number' || typeof data !== 'string' || !isEmpty(obj)
}

interface ReportNodeProps {
    data: any
    type: 'found' | 'expected'
    tab?: number
}

export const ReportNode = observer(({data, type, tab=0}: ReportNodeProps) => {
    if (typeof data === 'number' || typeof data === 'string') {
        return (
            <span>
                {data}
            </span>
        )
    }

    if (data === undefined) {
        return (
            <span>
                {'-'}
            </span>
        )
    }

    if (isEmpty(data)) {
        return <>{data}</>
    }

    const space = ' '.repeat(tab * 4);

    const dataGetter = (data: {expected: any, found: any}) => {
        if (type === 'expected') {
            return data.expected;
        }
        return data.found;
    }
    
    const classType = type === 'expected' ? 'correct' : 'incorrect'

    if (detectDiff(data)) {
        return (
            <div className={classType + ' inline'}>
                <ReportNode data={dataGetter(data)} type={type} tab={tab}/>
            </div>
        )
    }

    return (
        <div className="inline json">
            <div>{'{'}</div>
            {
                Object.entries(data).map(([name, value], i) => {
                    return (
                        <pre key={i}>
                                {space + ' '.repeat(4) + name + (isPrintable(value as any) ? ': ' : '')}
                                <ReportNode data={value} type={type} tab={tab+1}/>
                                {i === Object.entries(data).length - 1 ? '' : ','}
                        </pre>
                    )
                })
            }
            <div>{space + '}'}</div>
        </div>
    )
})

export const Report = observer(() => {
    return (
       <div className="report-container">
           <h1>{store.currentTab.name}</h1>
           <div className="report__header">
                {data.name}
           </div>

           <div className="report__url">
               {data.url}
           </div>

            <div className="comparison-table">
                {
                    Object.entries(data.comparison_result).map((result, i)=>(
                        <ComparisonTableCell
                            key={i}
                            name={result[0]}
                            isCorrect={detectDiffR(result[1])}
                            data={result[1]}
                        />
                    ))
                }
            </div>
       </div> 
    )
})
