import { observer } from "mobx-react-lite"
import { isEmpty, detectDiff, detectDiffR } from "../../../common/utils"
import { TestReport, store } from "../stores/AppStore";
import { ExplorerList } from "./Explorer";

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
    return typeof obj === 'number' || typeof obj === 'string' || !isEmpty(obj)
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

export const ReportListTab = observer((props: {name: string, tab_id: number}) => {
    return (
        <div className="tab" onClick={()=>{store.currentTab.setCurrentReportId(props.tab_id)}}>
            {props.name}
        </div> 
    )
})

export const Report = observer(() => {
    const ComparisonResultData = (props: {currentReport: TestReport | undefined}) => {
        if (props.currentReport === undefined) {
            return (
                <div>
                    Отчёт не выбран
                </div>
            )
        }

        return (
            <div className="comparison-table">
            {
                Object.entries(props.currentReport.comparison_result).map((result, i)=>(
                    <ComparisonTableCell
                        key={i}
                        name={result[0]}
                        isCorrect={detectDiffR(result[1])}
                        data={result[1]}
                    />
                ))
            }
            </div>
        )
    }

    return (
       <div className="report-container">
            <div className="report__explorer">
                    <ExplorerList elems={store.currentTab.reports.map((report, i) => (
                        <ReportListTab name={report.name} tab_id={i} />
                    ))}/>
            </div>

            <div className="padding">
                <ComparisonResultData currentReport={store.currentTab.currentReport}/>
                {/* <div className="comparison-table">
                        {

                            Object.entries(store.currentTab.currentReport.comparison_result).map((result, i)=>(
                                <ComparisonTableCell
                                    key={i}
                                    name={result[0]}
                                    isCorrect={detectDiffR(result[1])}
                                    data={result[1]}
                                />
                            ))
                        }
                </div> */}
            </div>
        </div> 
    )
})
