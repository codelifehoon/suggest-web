import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {MenuItem,TextField,Button,Typography} from '@material-ui/core';
import axios from "axios/index";
import NavigationML from "./NavigationML";
import {ML_URL} from "../../util/Config";
import {XYPlot, XAxis, YAxis, VerticalBarSeries, VerticalBarSeriesCanvas, LabelSeries} from "react-vis";

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
        width: '99%',
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
        value: '-',
    },
    {
        label: '상품명1',
        value: '정품 돼지토끼 캐릭터모자',
    },
    {
        label: '상품명2',
        value: '베이직 슬림 밍크목도리/털목도리/인조밍크',
    },
    {
        label: '상품명3',
        value: '여성 여름 밀짚모자 일본 여름 모자 여성',
    },
];





class CateSuggestML extends React.Component {
    state = {
        analysisText:'',
        responseChart:'',
        predict_sum:0
    };


    analysisTextChange  = (e) =>{

        this.setState({analysisText: e.target.value});
        // Promise.resolve().then(()=>this.doAnalysis());
    }

    optionChange = name => event => {
        this.setState({
            [name]: event.target.value,
            analysisText : event.target.value
        });
    };

    doAnalysis = () =>{

        let sentence = encodeURIComponent(this.state.analysisText);

        // console.log('request sentence:' + sentence)
        const reqUrl = ML_URL + '/catesuggest?goodsnm=' + sentence;

        axios.get(reqUrl
            ,{headers: {'Content-Type': 'application/json'}}
            ).then(res => {
                this.processingResult(res.data)
            })
            .catch(err => { console.error('>>>> :' + err); });
    }

    processingResult = (data) =>{


        let predict_sum = 0;
        let visualLists = [];
        let x_count = 0;

        data.map((d)=>{

                const row = {
                    x:x_count*2,
                    y:d.y_predict,
                    label: '('+d.y_predict.toFixed(2)+')' + d.cate_name
                }



            visualLists = visualLists.concat(row);
            predict_sum += d.y_predict
            x_count++;

        });

        this.setState({responseChart:visualLists,predict_sum:predict_sum});


    }

    optionChange = name => event => {

        this.setState({
            [name]: event.target.value,
            analysisText : event.target.value
        });
    };



    render() {
        let useCanvas = false;
        const { classes } = this.props;
        const {analysisText, responseChart,predict_sum} = this.state;


        return (
            <div >
                <NavigationML/>
                <form className={classes.container} noValidate autoComplete="off">

                    <TextField
                        id="filled-select-currency-native"
                        select
                        label="상품명 예제"
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
                        label="상품명을 입력하세요."
                        multiline
                        rows="2"
                        defaultValue="Default Value"
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        value={analysisText}
                        onChange={this.analysisTextChange}
                    />

                    <Button variant="contained" color="primary" className={classes.button} onClick={this.doAnalysis}>
                        Analysis
                    </Button>


                    <Typography variant="title" gutterBottom>
                        top3 predict sum score:{predict_sum}
                    </Typography>


                    <XYPlot width={500} height={300} yDomain={[0, 1]} xDomain={[0, 3]}
                    >
                        <VerticalBarSeries className="vertical-bar-series-example" data={responseChart} />
                        <XAxis />
                        <YAxis />
                        <LabelSeries
                            animation
                            allowOffsetToBeReversed
                            data={responseChart} />

                    </XYPlot>




                </form>

            </div>
        );
    }
}

CateSuggestML.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CateSuggestML);