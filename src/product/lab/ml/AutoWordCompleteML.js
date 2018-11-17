import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {MenuItem,TextField,Button} from '@material-ui/core';
import axios from "axios/index";
import * as Config from "../../util/Config";
import ReactJson from 'react-json-view'
import {LabelSeries, MarkSeries, XYPlot} from "react-vis";
import ReactDOM from 'react-dom';
import S from 'string'
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
        label: 'coding1',
        value: 'coding1_value',
    },
    {
        label: 'coding2',
        value: 'coding2_value',
    },
    {
        label: 'coding3',
        value: 'coding3_value',
    },
];


let sequence_length = 17;
class AutoWordCompleteML extends React.Component {
    state = {
        analysisText:'',
        outputWord:'',
        outputSentence:''
    };

    componentDidMount(){
        ReactDOM.findDOMNode(this).addEventListener('paste', this.outputWordPaste,false);
    }

    outputWordPaste =(e) =>{
        e.stopPropagation();
        e.preventDefault();

        let sentence = this.state.analysisText;
        let length = S(sentence).length
        sentence = S(sentence).left(length-sequence_length).s;
        sentence = sentence + this.state.outputWord

        this.setState({analysisText:sentence});
        Promise.resolve().then(()=>this.doAnalysis());

    }

    optionChange = name => event => {

        this.setState({
            [name]: event.target.value,
            analysisText : event.target.value
        });



    };

    analysisTextChange  = (e) =>{

        this.setState({analysisText: e.target.value});
        Promise.resolve().then(()=>this.doAnalysis());
    }

    doAnalysis = () =>{

        let sentence = this.state.analysisText;
        sentence = S(sentence).right(sequence_length).s;
        sentence = encodeURIComponent(sentence)

        // console.log('request sentence:' + sentence)
        const reqUrl = ML_URL + '/charcomplete?sentence=' + sentence;

        axios.get(reqUrl
            ,{headers: {'Content-Type': 'application/json'}}
            ).then(res => {
                this.showWord(res.data)
            })
            .catch(err => { console.error('>>>> :' + err); });
    }

    showWord = (data) =>{

        this.setState({ outputWord:data });
    }

    render() {
        const { classes } = this.props;
        const {analysisText, outputWord,outputSentence} = this.state;

        return (
            <div >
                <NavigationML/>
                <form className={classes.container} noValidate autoComplete="off">

                    {/*<TextField
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
                    </TextField>*/}

                    <TextField
                        id="filled-multiline-static"
                        label="Typing Code.."
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
                        label="Output-Word"
                        multiline
                        rows="3"
                        className={classes.textField33}
                        margin="normal"
                        variant="filled"
                        value={outputWord}
                    />
                    <TextField
                        id="color-multiline-static"
                        label="Output-Sentense"
                        multiline
                        rows="3"
                        className={classes.textField33}
                        margin="normal"
                        variant="filled"
                        value={outputSentence}
                    />

                    <Button variant="contained" color="primary" className={classes.button} onClick={this.doAnalysis}>
                        Analysis
                    </Button>

                </form>

            </div>
        );
    }
}

AutoWordCompleteML.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoWordCompleteML);