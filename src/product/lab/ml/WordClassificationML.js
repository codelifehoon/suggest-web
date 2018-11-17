import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {MenuItem,TextField,Button} from '@material-ui/core';
import axios from "axios/index";
import * as Config from "../../util/Config";
import ReactJson from 'react-json-view'
import {LabelSeries, MarkSeries, XYPlot} from "react-vis";
import NavigationML from "./NavigationML";
import {ML_URL} from "../../util/Config";



const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
    },
    textField33: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '30%',
    },

    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
        width: '100%',
    },
    jsonView: {
        padding: "10px",
        borderRadius: "3px",
        margin: "10px 0px"
    },

});

const currencies = [
    {
        label: '선택하세요',
        value: '',
    },
    {
        label: '기본',
        value: '230,235,240,245,250,그레이,블랙',
    },
    {
        label: '기타1',
        value: '네이비 / 250mm,네이비 / 255mm,네이비 / 260mm,네이비 / 265mm,네이비 / 270mm,네이비 / 275mm,네이비 / 280mm,블랙 / 250mm,블랙 / 255mm,블랙 / 260mm,블랙 / 265mm,블랙 / 270mm,블랙 / 275mm,블랙 / 280mm',
    },
    {
        label: '기타2',
        value: '230,235,240,245,250,255,260,265,270,275,280,A20,A7899,AT스페로,AT점보,AT점퍼,SKA8001,SL271,SOC9158,SOC9996,W센터,W셔플,그레이,네이비,네이비/핑크,라임,블랙,블랙/레드,블랙/화이트,블루',
    },
];


const myData = [
    {x: 0, y: 0, label: 'woah!', style: {fontSize: 10} , size: 0.1},
    {x: 1, y: 0, label: 'dope city', yOffset: 5 , size: 1},
    {x: 0, y: 1, label: 'cool Dog friend', xOffset: 5, rotation: 34, size: 1}
]


class WordClassificationML extends React.Component {
    state = {
        name: 'Cat in the Hat',
        age: '',
        multiline: 'Controlled',
        currency: 'EUR',
        analysisText:'옵션문자를 입력 해주세요.',
        responseJson:'',
        responseChart:'',
        sizeText:'',
        colorText:'',
        noneText:''
    };

    optionChange = name => event => {

        this.setState({
            [name]: event.target.value,
            analysisText : event.target.value
        });
    };

    analysisTextChange  = (e) =>{
        this.setState({analysisText: e.target.value});
    }

    doAnalysis = () =>{

        const reqUrl = ML_URL + '/wordanalysis';
        let requestJson ={  PRD_NO : '999',
                            OPT_NM : this.state.analysisText,
                        };

        axios.post(reqUrl
            ,requestJson
            ,{headers: {'Content-Type': 'application/json'}}
            ).then(res => {

                this.setState({responseJson:res.data})
                this.showVisual(res.data)


            })
            .catch(err => { console.error('>>>> :' + err); });

    }


    showVisual = (data) =>{
        let visualLists,sizeText='',colorText='',noneText='';

        visualLists = [];
        data.map((d)=>{

            d.predict.map((d) =>{

                let xval = 0;
                let row ;
                let randval =(Math.random() * 0.1);

                if (d.validation ===0){
                    xval=0;
                     noneText +=  d.words + ' ';
                }
                else if (d.predict === 0 && d.validation ===1) {
                    xval=1;
                    sizeText +=  d.words + ' ';// 사이즈
                }
                else if (d.predict === 1 && d.validation ===1) {
                    xval=2;
                    colorText +=  d.words + ' '; // 색상
                }

                row = {x: xval+randval,
                    y: d.maxval+randval,
                    label: d.words,
                    style: {fontSize:10},
                    size: 0.1}

                visualLists = visualLists.concat(row);
            });
        });

        this.setState({responseChart:visualLists
        ,sizeText:sizeText
        ,colorText:colorText
        ,noneText:noneText});
    }

    render() {
        const { classes } = this.props;
        const {analysisText,responseJson,responseChart,sizeText,colorText,noneText} = this.state;

        return (
            <div >
                <NavigationML/>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        id="filled-select-currency-native"
                        select
                        label="분석 문자열 예제"
                        className={classes.textField}
                        value={this.state.currency}
                        onChange={this.optionChange('currency')}
                        SelectProps={{
                            native: true,
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        helperText="Please select analysis string"
                        margin="normal"
                        variant="filled"
                    >
                        {currencies.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        id="filled-multiline-static"
                        label="분석문자열"
                        multiline
                        rows="8"
                        defaultValue="Default Value"
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        value={analysisText}
                        onChange={this.analysisTextChange}
                    />

                    <TextField
                        id="size-multiline-static"
                        label="SIZE"
                        multiline
                        rows="3"
                        className={classes.textField33}
                        margin="normal"
                        variant="filled"
                        value={sizeText}
                    />
                    <TextField
                        id="color-multiline-static"
                        label="COLOR"
                        multiline
                        rows="3"
                        className={classes.textField33}
                        margin="normal"
                        variant="filled"
                        value={colorText}
                    />
                    <TextField
                        id="none-multiline-static"
                        label="NONE"
                        multiline
                        rows="3"
                        className={classes.textField33}
                        margin="normal"
                        variant="filled"
                        value={noneText}
                    />



                    <Button variant="contained" color="primary" className={classes.button} onClick={this.doAnalysis}>
                        Analysis
                    </Button>

                </form>

                <XYPlot width={300} height={300} yDomain={[0.8, 1.5]} xDomain={[0, 3]}>
                    <MarkSeries
                        animation
                        allowOffsetToBeReversed
                        data={responseChart} />
                    <LabelSeries
                        animation
                        allowOffsetToBeReversed
                        data={responseChart} />
                </XYPlot>

                {responseJson != '' ? <ReactJson src={responseJson}
                                                 theme={'monokai'}
                                                 style={{textAlign:'left'}}
                                        /> : ''}

            </div>
        );
    }
}

WordClassificationML.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WordClassificationML);