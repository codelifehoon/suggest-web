import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeView from "./HomeView";
import './App.css';
import TemplateManager from "./product/CommonComponet/TemplateManager";
// import GoogleMap from "./product/content/GoogleMap";
import Async from 'react-code-splitting'
import GoogleMap from "./product/content/GoogleMap";



class App extends Component {
    render() {
        let componentVal = new Object();
        let routeComponentList = TemplateManager.getTemplateList();

        componentVal.root = 'roo`tName';

        return (

            <div className={'App'}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={HomeView}/>

                        { routeComponentList.map(page => {
                            return (<Route path={"/"+ page.componentName} key={page.key} render={ ()  => <HomeView  templateSelectorKey={page.componentName} /> }/>);
                        }) }

                        <Route path="/Map" component={GoogleMap}/>
                        {/*<Route path="/contentMain" component={ContentMain}/>*/}
                        <Route component={HomeView}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default  App;


