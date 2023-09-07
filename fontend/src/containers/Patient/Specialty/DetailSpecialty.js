import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss'
// import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from "../../Patient/Doctor/DoctorSchedule"
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo"
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialty, getAllcodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';


class DetailSpecialty extends Component {

    constructor (props) {
        super(props);
        this.state = {
            arrDoctor: [],
            dataDetailSpecialty: {},
            listProvince: []
        }
    }





    async componentDidMount() {


        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailSpecialty({
                id: id,
                location: 'ALL'
            });

            let resPovince = await getAllcodeService("PROVINCE")
            if (res && res.errCode === 0 && resPovince && resPovince.errCode === 0) {
                let data = res.data;
                let arrDoctor = []

                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctor.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctor: arrDoctor,
                    listProvince: resPovince.data
                })
            }

        }
    }




    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({

        //     })
        // }



    }


    handleOnchangeSelect = async (event) => {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;



            let res = await getDetailSpecialty({
                id: id,
                location: location
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctor = []

                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctor.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctor: arrDoctor,

                })
            }








        }

    }


    render() {
        let { arrDoctor, dataDetailSpecialty, listProvince } = this.state
        let { language } = this.props
        // console.log("check state", this.state);
        return (
            <div className=' detail-specialty-container'>
                <HomeHeader />


                <div className='detail-specialty-body'>
                    <div className='specialty-descriptions'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&

                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }} >
                            </div>}
                    </div>


                    <div className='search_doctor-sp'>
                        <select onChange={(event) => this.handleOnchangeSelect(event)} >
                            <option value="ALL"> {language === LANGUAGES.VI ? "Toàn quốc" : "ALL"}
                            </option>
                            {listProvince && listProvince.length > 0 && listProvince.map((item, index) => {

                                return (

                                    <option key={index} value={item.keyMap}>
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}


                                    </option>
                                )
                            })}


                        </select>

                    </div>
                    {arrDoctor && arrDoctor.length > 0 &&
                        arrDoctor.map((item, index) => {
                            return (


                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            //    dataTime={dataTime}
                                            />

                                        </div>
                                    </div>
                                    <div className='dt-content-right'>

                                        <div className='doctor-schedule'>
                                            <DoctorSchedule
                                                doctorIdfromparent={item}

                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>  <DoctorExtraInfo
                                            doctorIdfromparent={item}
                                        /></div>


                                    </div>
                                </div>
                            )
                        })}

                </div>



            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,


    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
