import './App.css';

function Tab(props: {name: string, tab_key: number}) {
    return (
        <div key={props.tab_key} className="tab">
            {props.name}
        </div>
    )
}

function Exlorer(props: {tabs: any[]}) {
    return (
        <div className="explorer">
            explorer
            {
                props.tabs.map((tab, i) => <Tab key={i} tab_key={i} name={tab.name}></Tab>)
            }
        </div>
    )
};

export default Exlorer
