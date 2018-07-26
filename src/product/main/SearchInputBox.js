import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MenuItem,Typography ,Paper,TextField,withStyles} from '@material-ui/core';


let suggestions  = null;

function renderInput(inputProps) {
    const { classes, autoFocus, value, ref, ...other } = inputProps;

    return (
        <TextField
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            InputProps={{
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
        />
    );
}


function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.autoCompliteText, query);
    const parts = parse(suggestion.autoCompliteText, matches);


    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
}

function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

function getSuggestionValue(suggestion) {
    return suggestion.autoCompliteText;
}

function getSuggestions(value,autoCompliteList) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;


    return inputLength === 0
        ? []
        : autoCompliteList.filter(suggestion => {
            const keep =  count < 5 && suggestion.autoCompliteText.toLowerCase().slice(0, inputLength) === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 50,
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    textField: {
        width: '100%',
        float: 'right',
    },
});

class IntegrationAutosuggest extends React.Component {
    state = {
        value: '',
        suggestions: [],
    };

    componentDidMount(){
        this.setState({value:this.props.searchTextValue});
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value,this.props.autoCompliteList),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    searchTextChange = (event, { newValue }) => {
        this.setState({value: newValue,});
        this.props.onChange(newValue,false);
    };

    onFormSubmit = (e) => {
        this.props.onChange(this.state.value,true);
        e.preventDefault();
}

    render() {
        const { classes } = this.props;

        return (
            <div >
                <form onSubmit={this.onFormSubmit}>
                <Autosuggest
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderInputComponent={renderInput}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    keyYouShouldPressToTriggerSubmit={13}   // enter 입력시 summit 호출되도록
                    inputProps={{
                        autoFocus: false,
                        classes,
                        placeholder: '검색어를 입력 해주세요.',
                        value: this.state.value,
                        onChange: this.searchTextChange,
                    }}
                />


                </form>
            </div>
        );
    }
}

IntegrationAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    autoCompliteList: PropTypes.array.isRequired

};

IntegrationAutosuggest.defaultProps = {
    autoCompliteList : [],
}

export default withStyles(styles)(IntegrationAutosuggest);
