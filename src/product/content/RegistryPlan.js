import React from 'react';
import {Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {Button, TextField, Typography,LinearProgress} from "@material-ui/core";
import dateformat from 'dateformat';
import {withRouter} from "react-router-dom";
import * as util  from '../util/CommonUtils';
import * as GoogleAPI  from '../util/GoogleAPI';
import {EditForMarkdown} from "../CommonComponet/EditForMarkdown";

import axios from "axios/index";
import DialogForNoti from "../CommonComponet/DialogForNoti";
import {getUrlParam} from "../util/CommonUtils";
import * as Config from "../util/Config";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import FileUploader from "react-firebase-file-uploader";
import * as firebase from 'firebase';
import LineImageList from "../CommonComponet/LineImageList";
import {setIntergratSearchReload} from "../util/CommonUtils";



const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginRight: theme.spacing.unit,
        width: '100%',
    },
    textStartEndTimeField: {
        width: 200,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});


class RegistryPlan extends React.Component {

    state = {
        contentNo : null,
        title:'',
        eventAddress:'',
        eventStart: '', // dateformat(new Date(),'yyyy-mm-dd')+'T10:00',
        eventEnd: '',  // dateformat(new Date(),'yyyy-mm-dd')+'T18:00',
        eventDesc :null,
        repeatKind : 'NONE',
        tags : '',
        chipData: [],
        storageFlag:false,
        submitCheckFlag:false,
        dialogForNoti : null,
        eventLatLng : {lat : null , lng : null },
        editable : false,

        // isUploading: false,
        // progress: 0,
        fileuploadCount : 0,
        fileuploadUrls: []

    };



    handleUploadStart = () => true;
    // handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        // this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = (filename,sec) => {

        console.log(sec);
        this.setState({fileuploadCount : this.state.fileuploadCount + 1});

        const fullPath  = firebase.storage().ref(Config.FIREBASE_STORAGE).child(filename).fullPath;
        firebase
            .storage()
            .ref(Config.FIREBASE_STORAGE)
            .child(filename)
            .getDownloadURL()
            .then(url => {
                const tile = {key : url
                    ,tile : filename
                    ,fullPath : fullPath
                    ,img : url};

                this.setState({ fileuploadUrls: this.state.fileuploadUrls.concat(tile) })
            });
    };


    componentDidMount(){
        const cachedHits = sessionStorage.getItem('planStorage');

        if (!cachedHits && getUrlParam(this.props,'eventContentNo')) {
            this.initEditData(getUrlParam(this.props,'eventContentNo'));
        }
        else {

            if (cachedHits) {
                let cacheObj = JSON.parse(cachedHits);
                // cacheObj.eventDesc = '';        // 화면전환 후 상품상세는 초기화 한다.( 복구시 잘안되어서.. 지금은 복구 없는 상황이 좋을듯..)
                this.setState(cacheObj);
                // session Storage 갱신flag변경
            }

            this.setState({storageFlag: true, submitCheckFlag: false, dialogForNoti: null});
            this.initFormattedAddress();
        }

        ValidatorForm.addValidationRule('checkEventEnd', (value) => {

            const eventStart = new Date(this.state.eventStart);
            const eventEnd = new Date(this.state.eventEnd);
            const yesterDay = new Date();
            yesterDay.setDate(yesterDay.getDate() -1);

            // eventEnd는 eventStart보다 커야한다.
            if (eventEnd < eventStart ) return false;

            // eventEnd는 등록일 -1 보다 커야한다.
            if (eventEnd <= yesterDay ) return false;

            return true;


        });



    }

    initEditData = (eventContentNo) =>{

        axios.get(Config.API_URL + '/Content/V1/findContentForContentMain/' + eventContentNo)
            .then(res =>{

                const d = res.data.eventContent;
                const fileuploadCount  = d.contentStorages.length;
                const fileuploadUrls = d.contentStorages.map( d =>{ return {img: d.storageValue
                                                                    , key: d.contentStorageNo
                                                                    , tile: d.contentStorageNo
                                                                    };
                                                                });


                const initJson = {
                    contentNo : d.eventContentNo,
                    title:d.title,
                    eventAddress: d.eventLocations[0].address,
                    eventStart: dateformat(new Date(d.eventStart),'yyyy-mm-dd'), // dateformat(new Date(),'yyyy-mm-dd')+'T10:00',
                    eventEnd: dateformat(new Date(d.eventEnd),'yyyy-mm-dd'),  // dateformat(new Date(),'yyyy-mm-dd')+'T18:00',
                    eventDesc :d.eventDesc,
                    repeatKind : 'NONE',
                    tags : d.tags,
                    eventLatLng : {lat : d.eventLocations[0].latitude , lng : d.eventLocations[0].longitude },
                    editable : true,
                    fileuploadUrls : fileuploadUrls,
                    fileuploadCount : fileuploadCount
                };

                this.setState(initJson);

                // editer의 초기값을 설정할때 storageFlag값이  true일때 최초에 한번 하는데 true가 state.eventDesc 보다 먼저 되면 초기값을넘길수 없음.
                this.setState({storageFlag:true,submitCheckFlag:false,dialogForNoti:null,editable:true,contentNo : d.eventContentNo,});


            }).catch(err => { console.error('>>>> :' + err);});


    }

    initFormattedAddress = () =>{


        let latLng = util.getUrlParam(this.props,'latLng');
        if (latLng) {


            latLng = JSON.parse(latLng);

            this.setState({eventLatLng : latLng });

            GoogleAPI.getFormattedAddressFromLocation(latLng)
                .then(formattedAddress => {
                    this.setState({eventAddress:formattedAddress});
                })
                .catch(e => {});
        }
    }


    handleDefaultChange  = (event) =>{


        let str  = event.target.id;
        console.log(str);
        if (event.target.id === 'title'){
            this.setState({title: event.target.value});
        } else if (event.target.id === 'eventAddress'){
            this.setState({eventAddress: event.target.value});
        }
        else if (event.target.id === 'eventStart'){
            console.log("##### handleDefaultChange ##### ");
            console.log(event.target.value);

            // const localEventStart = event.target.value  + " 00:00:00";
            // const localEventEnd = event.target.value  + " 23:59:59";
            // console.log(localEventStart);
            // console.log(localEventEnd);

            if (!this.state.eventEnd) {
                // this.setState({eventStart: localEventStart,eventEnd: localEventEnd});
                this.setState({eventStart: event.target.value,eventEnd: event.target.value});

            }else{
                this.setState({eventStart: event.target.value});
            }
        }
        else if (event.target.id === 'eventEnd'){
            this.setState({eventEnd: event.target.value});
        }

    };


// 암묵적 function 이어서 life 현 this을 scop으로 자동 적용 된듯
// 명시적으로 funciton 생성하면 bind 해야 할것 같은데.
    handleDelete = data => () => {
        if (data.label === 'React') {
            alert('Why would you want to delete React?! :)'); // eslint-disable-line no-alert
            return;
        }

        const chipData = [...this.state.chipData];
        const chipToDelete = chipData.indexOf(data);
        chipData.splice(chipToDelete, 1);
        this.setState({ chipData });
    };

    searchTagKeyDown = (event) => {
        console.debug(event.key);
        if(event.key === ' '){
            let tagValue = event.target.value;
            let chipData = this.state.chipData;
            let  arrayLength = chipData.length;
            let addChipData = new Object();

            if (chipData.find((e) => { if (e['key'] === tagValue) return true;})) {
                event.target.value ='';
                return;
            }

            addChipData['key'] = tagValue;

            chipData.splice(arrayLength,0,addChipData);

            this.setState({tags : ''});
            this.setState({chipData});
        }
    };
    searchTagChange = (event) =>{
        this.setState({tags : event.target.value});
    };

    handleSubmit = (event) => {


        if (event.target.id === 'formSubmitBtn')
        {
        }

        event.preventDefault();
    };

    onChoiceMapClick = () => {

        let stateStr = JSON.stringify(this.state);
        let returnUrl = encodeURIComponent('/registryPlan');

        if (this.state.editable){
            returnUrl = encodeURIComponent('/editRegistryPlan');
        }

        sessionStorage.setItem('planStorage', JSON.stringify(this.state));
        this.props.history.push('/Map?returnUrl=' + returnUrl);

    };

    onRepeatKindClick = (e) => {
        this.setState({repeatKind : e.target.value});
    };

    onEditorStateChange = (contentRaw) =>{

        this.setState({eventDesc:contentRaw});
    };

    onSubmitClick = () =>
    {

        // session 정리
        sessionStorage.removeItem('planStorage');
        if (this.state.submitCheckFlag) { alert('처리중 입니다.'); return;}


        const eventStart = this.state.eventStart + " 00:00:00";
        const eventEnd = this.state.eventEnd + " 23:59:59";

        const  jsonValue = {
            eventDesc: this.state.eventDesc,
            eventLocations: [
                {
                    address: this.state.eventAddress,
                    addressDtls: '',
                    latitude: this.state.eventLatLng.lat,
                    longitude: this.state.eventLatLng.lng,
                    useYn: 'Y',
                }
            ],
            eventStart: new Date(eventStart),
            eventEnd: new Date(eventEnd),
            refPath: '',
            repeatKind: this.state.repeatKind,
            stat: 'S2',
            tags: this.state.tags,
            title: this.state.title,
            contentStorages : this.state.fileuploadUrls.map(d=>{return {storageValue:d.img , fullPath : d.fullPath};})
        };


        let reqUrl = '';

        if (this.state.editable){
            reqUrl = Config.API_URL + '/Content/V1/updateContent/' + this.state.contentNo;
        }
        else{
            reqUrl = Config.API_URL + '/Content/V1/addContent';
        }

        axios.post(reqUrl
                    ,jsonValue
                    ,{withCredentials: true, headers: {'Content-Type': 'application/json'}}
            )
            .then(res =>{
                setIntergratSearchReload(true);
                this.setState({submitCheckFlag : false});
                this.editSuccessDlg(res);

            }).catch(err => { console.error('>>>> :' + err);  this.setState({submitCheckFlag : false}); this.addFailDlg(err); });
    }


    deleteContent = ()=>{
        sessionStorage.removeItem('planStorage');

        axios.patch(Config.API_URL + '/Content/V1/updateContentStat/' + this.state.contentNo + '/S4'
                        ,{}
                        ,{withCredentials: true, headers: {'Content-Type': 'application/json'}}
                    )
                    .then(res =>{
                        // 컨텐츠 수정이 있었다면 메인으로 이동시 전체 리스트를 다시 읽어줄수 있도록한다.
                        setIntergratSearchReload(true);
                        this.props.history.push('/');

                    }).catch(err => { console.error('>>>> :' + err);  this.setState({submitCheckFlag : false}); this.addFailDlg(err); });

    }

    editSuccessDlg = (res) => {
        if (this.state.editable) {
            this.props.history.push('/contentMain?eventContentNo=' + this.state.contentNo);
        } else {
            this.setState({dialogForNoti : this.addSuccessDlgGen() });
        }
    };
    addSuccessDlgGen = ()=>{

        this.setState({dialogForNoti : null });
        const confirmButtons = [{ func:this.addSuccessGoMain , color : 'primary' , text : '메인이동'}
                                ,{ func:this.addSuccessGoReReg  , color : 'primary' , text : '추가등록'}];

        return (<DialogForNoti  dialogTitle={'등록완료'} dialogMessage={'일정 등록이 완료 되었습니다.다음 진행 과정을 선택 해주세요'} confirmButtons={confirmButtons} />);
    }
    addSuccessGoMain = () =>{ this.props.history.push('/'); }
    addSuccessGoReReg = () =>{

        this.setState ( {
            title:'',
            eventAddress:'',
            eventLatLng:'',
            eventStart:  '', //공백으로 했을때 선택 값 변경이 안되어서..
            eventEnd:  '',//dateformat(new Date(),'yyyy-mm-dd')+'T18:00',
            eventDesc :'#입력해주세요#',
            repeatKind : 'NONE',
            chipData: [],
            storageFlag:true,
            submitCheckFlag:false,
            dialogForNoti : null,
            eventLatLng : {lat : null , lng : null },

            fileuploadCount : 0,
            fileuploadUrls: []
            });

        // 실시간 처리시 dlg 사라지기전의 action이어서 적용된것이 다리얼로그 사라질때 빠짐
        // 비동기 처리로 순차처리 끝나고 실행 될수 있도록 조치
        Promise.resolve().then(()=>document.querySelector("div input[id=title]").focus());

    }



    addFailDlg = (err) => {
        this.setState({dialogForNoti : null });
        this.setState({dialogForNoti : this.addFailDlgGen(err) });
    }

    addFailDlgGen = (err) => {
        return (<DialogForNoti  dialogTitle={'등록오류'} dialogMessage={err.toString()} />);
    }

    deleteImageList = (data) =>{
        const newFileuploadUrls =  this.state.fileuploadUrls.filter( (d) => d.key !== data.key);
        const fileuploadCount = --this.state.fileuploadCount;

        // console.log('###################');
        // console.log(newFileuploadUrls);
        // console.log(this.state.fileuploadCount);

        this.setState({fileuploadUrls: newFileuploadUrls
            ,fileuploadCount : fileuploadCount
            });
    }


    render() {


    const  {classes} = this.props;
    const  {storageFlag,dialogForNoti,editable,fileuploadUrls} = this.state;

        return (
            <div>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.onSubmitClick}
                    // onError={errors => console.log(errors)}
                >
                <Grid container>
                    <Grid item xs={12}/><Grid item xs={12}/><Grid item xs={12}/><Grid item xs={12}/>
                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <TextValidator
                            id="title"
                            name="title"
                            label="(필수)입력 해주세요."
                            className={classes.textField}
                            margin="normal"
                            value={this.state.title}
                            validators={['required']}
                            errorMessages={[]}
                            onChange={this.handleDefaultChange}
                        />


                    </Grid>


                    <Grid item xs={1}/>
                    <Grid item xs={8}>
                        <TextField
                            id="eventAddress"
                            label="위치를 선택 또는 입력 해주세요."
                            className={classes.textField}
                            helperText=""
                            margin="normal"
                            value={this.state.eventAddress}
                            onChange={this.handleDefaultChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                            <Typography variant="button" gutterBottom onClick={this.onChoiceMapClick}>
                                지도선택
                            </Typography>
                    </Grid>
                    <Grid item xs={12}><br/></Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={11} style={{textAlign:'left'}}>
                        {/*초기 bind시 null 값이로 하면  warning 발생해서 ''으로 조치*/}
                        <TextValidator
                            id="eventStart"
                            name="eventStart"
                            label="시작일(필수)"
                            type="date"
                            // defaultValue={this.state.eventStart}
                            value={this.state.eventStart}
                            className={classes.textField}
                            InputLabelProps={{shrink: true,}}
                            onChange={this.handleDefaultChange}
                            style={{width: '90%'}}
                            validators={['required']}
                            errorMessages={['']}
                        />
                    </Grid>
                    <Grid item xs={12}><br/></Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={11} style={{textAlign:'left'}}>
                        <TextValidator
                            id="eventEnd"
                            name="eventEnd"
                            label="종료일(필수)"
                            type="date"
                            // defaultValue={this.state.eventEnd}
                            value={this.state.eventEnd}
                            className={classes.textField}
                            InputLabelProps={{shrink: true,}}
                            onChange={this.handleDefaultChange}
                            style={{width: '90%'}}
                            validators={['required','checkEventEnd']}
                            errorMessages={['','종료일은 시작일,당일보다는 커야 합니다.']}
                        />
                    </Grid>
{/*

                    <Grid item xs={12}>
                        <Typography  variant="body1" gutterBottom>
                        없음:<Radio
                            checked={this.state.repeatKind === 'NONE'}
                            onChange={this.onRepeatKindClick}
                            value='NONE'
                            name="radio-button-NONE"
                            label="Male"

                        />

                        매일:<Radio
                                checked={this.state.repeatKind === 'W1'}
                                onChange={this.onRepeatKindClick}
                                value='W1'
                                name="radio-button-W1"

                            />

                        매월:<Radio
                                checked={this.state.repeatKind === 'M1'}
                                onChange={this.onRepeatKindClick}
                                value='M1'
                                name="radio-button-M1"

                            />

                            매년:<Radio
                                checked={this.state.repeatKind === 'Y1'}
                                onChange={this.onRepeatKindClick}
                                value='Y1'
                                name="radio-button-Y1"
                            />
                        </Typography>
                    </Grid>
*/}

                    <Grid item xs={12} >
                        <br/>
                        {
                            storageFlag  ? <EditForMarkdown onEditorStateChange={this.onEditorStateChange} initRowText={this.state.eventDesc}/> : ''

                        }
                    </Grid>

                    <Grid item xs={1}/>
{/*
                    <Grid item xs={11}>
                        <TextField
                            id="with-searchTagInput"
                            label="검색용 테그 입력 해주세요(#검색어)"
                            placeholder="여러건 추가 가능 합니다.(최대10건)"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.tags}
                            // onKeyPress={this.searchTagKeyDown}
                            onChange={this.searchTagChange}
                        />
                    </Grid>


                    <Grid container>
                        <Grid item xs={1} />
                        <Grid item  xs={11} >
                            {this.state.chipData.map(data => {
                                return (
                                    <Chip id={'searchTagArray'}
                                        key={data.key}
                                        label={data.key}
                                        onDelete={this.handleDelete(data)}
                                        className={classes.chip}
                                    />
                                );
                            })}
                        </Grid>
                    </Grid>

                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}

                    <div style={{flexGrow:1}}>
                        <LinearProgress variant="determinate" value={this.state.progress} />
                    </div>
*/}



                    <Grid container>
                        <Grid item xs={12}>
                            {fileuploadUrls.length > 0 ? <LineImageList style={{'maxWidth':'100%'}} tileList={fileuploadUrls} onDelete={this.deleteImageList}/> : ''}
                        </Grid>
                    </Grid>


                    <Grid container>
                        <Grid item xs={12}>
                            <Button className={classes.button} variant='outlined' color="primary" type='submit'>
                                {editable ? '수정하기' :'등록하기'}
                            </Button>

                            {editable ? <Button className={classes.button} variant='outlined' color="secondary" onClick={this.deleteContent}>삭제</Button>
                                : ''
                            }

                            { this.state.fileuploadCount < 5 ?
                                <label style={{backgroundColor: 'steelblue', color: 'white', padding: 9, borderRadius: 4, pointer: 'cursor'}}>
                                    파일등록
                                    <FileUploader
                                        accept="image/*"
                                        name="fileupload"
                                        randomizeFilename
                                        onUploadStart={this.handleUploadStart}
                                        storageRef={firebase.storage().ref(Config.FIREBASE_STORAGE)}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        hidden
                                        multiple
                                    />
                                </label>
                                    : ''
                            }
                        </Grid>
                    </Grid>
                </Grid>

                {/*alert msg*/}
                {dialogForNoti}

                {/*<input ref={input => { this.testNameInput = input; }} />*/}
                </ValidatorForm>
            </div>
        );
}
}

RegistryPlan.propTypes = {};
export default withStyles(styles)(withRouter(RegistryPlan) );