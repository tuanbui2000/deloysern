import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./ManageDoctor.scss"
import * as actions from "../../../store/actions"
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInfoDoctor } from "../../../services/userService"


const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor (props) {
        super(props);
        this.state = {
            //save to markdown table
            contentHTML: '',
            contentMarkdown: '',
            selectedOption: '',
            description: '',
            listDoctors: [],


            //save to doctor-infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId:'',

            //status
            hasOldData: false,

        }
    }
    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();

    }


    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {

                    let object = {};

                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            } if (type === "PRICE") {
                inputData.map((item, index) => {

                    let object = {};

                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {

                    let object = {};

                    let labelVi = `${item.valueVi} `;
                    let labelEn = `${item.valueEn} `;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY' ||type === 'CLINIC') {
                inputData.map((item, index) => {

                    let object = {};     
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }
          

        }
        return result
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPayment, resPrice, resProvince,resSpecialty,resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic ,"CLINIC")
            // console.log("check new allRequiredDoctorInfo : ", this.props.allRequiredDoctorInfo);


            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty:dataSelectSpecialty,
                listClinic:dataSelectClinic
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }





    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        }
        )
    }


    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,


            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic &&this.state.selectedClinic.value?this.state.selectedClinic.value:'' ,
            specialtyId: this.state.selectedSpecialty.value,


        })
    }


    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince, listSpecialty , listClinic} = this.state;
        let res = await getDetailInfoDoctor(selectedOption.value)
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let addressClinic = '',
                nameClinic = '',
                priceId = '',
                paymentId = '',
                provinceId = '',
                specialtyId = '',
                note = '',
                selectedPayment = '',
                selectedPrice = '',
                selectedProvince = '',
                selectedSpecialty = '',
                clinicId = '',
                selectedClinic =''





            if (res.data.Doctor_infor) {
                addressClinic = res.data.Doctor_infor.addressClinic;
                nameClinic = res.data.Doctor_infor.nameClinic;
                note = res.data.Doctor_infor.note;

                priceId = res.data.Doctor_infor.priceId;
                paymentId = res.data.Doctor_infor.paymentId;
                provinceId = res.data.Doctor_infor.provinceId;
                specialtyId = res.data.Doctor_infor.specialtyId;
                clinicId = res.data.Doctor_infor.clinicId;


                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })



                // console.log('tun check new onchange', res.data.Doctor_infor);
                // console.log('tun check list', listProvince);
                // console.log('tun check selected', selectedProvince);

            }


            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedProvince: selectedProvince,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedProvince: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedSpecialty:'',
                selectedClinic:'',

            })
        }
        // console.log("hoiure aslfjsldf", res);
    };


    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value

        this.setState({
            ...stateCopy
        })

    }


    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption


        this.setState({
            ...stateCopy

        })
    }

    render() {
        let { hasOldData } = this.state
        // console.log("check state, ", this.state);


        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>                 <FormattedMessage id="admin.manage-doctor.choose-doctor" /></label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-doctor" />}
                        />

                    </div>
                    <div className='content-right'>
                        <label>                 <FormattedMessage id="admin.manage-doctor.introduction-info" /></label>
                        <textarea className='form-control' rows='4'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>

                </div>

                <div className='more-infor-extra row'>

                    <div className='col-4 form-group'>
                        <label>     <FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"

                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>   <FormattedMessage id="admin.manage-doctor.Payment" /> </label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.Payment" />}
                            name="selectedPayment"
                        />

                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.province" /> </label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectedProvince"
                        />

                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic" /> </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}

                        />

                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic" />  </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />

                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /> </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />

                    </div>
                </div>




                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-specialty" />  </label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-specialty" />}
                            name="selectedSpecialty"
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-clinic" /> </label>
                        <Select
                            // className='form-control'
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                            name="selectedClinic"
                        />
                    </div>


                </div>





                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '400px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}

                    />
                </div>


                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOldData === true ? 'save-content-doctor' : "create-content-doctor"}>
                    {hasOldData === true ? <span>
                        <FormattedMessage id="admin.manage-doctor.save-info" />
                    </span> : <span>
                        <FormattedMessage id="admin.manage-doctor.create-info" />

                    </span>}


                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {

        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
