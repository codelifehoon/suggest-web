import React, { Component } from 'react';
import { EditorState , ContentState ,convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import  PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {stateToHTML} from "draft-js-export-html";
import {stateFromHTML} from "draft-js-import-html";



export class EditForMarkdown extends Component {


    constructor(props) {
        super(props);


        this.state = {
            editorState: EditorState.createEmpty()
        };
    }

    componentDidMount(){

        // 붙이기 별도처리 안함.
        // ReactDOM.findDOMNode(this).addEventListener('paste', this.eventHandle,false);

        if (this.props.initRowText){

            this.setEditorState(this.props.initRowText);

        }else{

            this.setState({editorState: EditorState.createWithContent(ContentState.createFromText('#입력해주세요#'))});
        }
    }

    setEditorState(doc) {
        const blocksFromHtml = htmlToDraft(doc);
        const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);
        this.setState({editorState: EditorState.createWithContent(contentState)});
    }

    eventHandle = (e)=>{


        let clipboardData, pastedData;

        // Stop data actually being pasted into div
        e.stopPropagation();
        e.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        // pastedData = clipboardData.getData('text/plain');
        pastedData = clipboardData.getData('text/html');


        // 이미지 변환시 최대 사이즈 조정을 위해서 style추가
        let options = {
            entityStyleFn: (entity) => {
                const entityType = entity.get('type').toLowerCase();
                if (entityType === 'image') {
                    const data = entity.getData();

                    return {
                        element: 'img',
                        attributes: {
                            src: data.src,
                        },
                        style: {
                            'width' : '100%'
                            ,'height': '100%'
                        },
                    };
                }
            },
        };

        // html -> state -> html (for add style)
        const contentState = stateFromHTML(pastedData);      // markdown으로 생각하고 state 구조를 가져오고
        const contentHtml =  stateToHTML(contentState,options);       // satet를 Html로 변경 (html 변경시 < 테그는  &lt;로 전환됨


        // in html
        this.setEditorState(contentHtml);
        this.props.onEditorStateChange(contentHtml);

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });

        const contentState = this.state.editorState.getCurrentContent();
        const contentHtml = draftToHtml(convertToRaw(contentState));
        this.props.onEditorStateChange(contentHtml);
    };

    onFocusEditer = () => {
        const plainText =this.state.editorState.getCurrentContent().getPlainText();
        if (plainText === '#입력해주세요#') {
            this.setState({
                editorState : EditorState.createEmpty()
            });
        }

    }
    render() {

        const { editorState } = this.state;
        // maxWidth:'100%'
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid Gainsboro',width:'100%',wordBreak:'break-all'}}
                // wrapperClassName="demo-wrapper"
                // editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                onFocus={this.onFocusEditer}
                localization={{locale: 'ko',}}
                toolbar={{
                    options: ['inline',   'fontSize'],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                        bold: { className: 'bordered-option-classname' },
                        italic: { className: 'bordered-option-classname' },
                        underline: { className: 'bordered-option-classname' },
                        strikethrough: { className: 'bordered-option-classname' },
                        code: { className: 'bordered-option-classname' },
                    },
                    blockType: {
                        className: 'bordered-option-classname',
                    },
                    fontSize: {
                        className: 'bordered-option-classname',
                    },
                }}
            >
            </Editor>
        )
    }
}

/*

EditForMarkdown.propTypes = {
    onEditorStateChange : PropTypes.func.isRequired,
};

EditForMarkdown.defaultProps ={
    initRowText :'',
}
*/
