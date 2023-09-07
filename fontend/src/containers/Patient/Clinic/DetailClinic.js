import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailClinic.scss'
// import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from "../../Patient/Doctor/DoctorSchedule"
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo"
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinic, getAllcodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';


class DetailClinic extends Component {

    constructor (props) {
        super(props);
        this.state = {
            arrDoctor: [],
            dataDetailClinic: {},
        }
    }





    async componentDidMount() {


        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailClinic({
                id: id,
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctor = []

                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctor.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctor: arrDoctor,
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


    render() {
        let { arrDoctor, dataDetailClinic } = this.state
        // console.log('checkstate', this.state);
        let { language } = this.props
        return (
            <div className=' detail-specialty-container'>
                <HomeHeader />


                <div className='detail-specialty-body'>
                    <div className='specialty-descriptions'>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&

                            <>

                                <div><h1>{dataDetailClinic.name}</h1></div>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }} >
                                </div>
                            </>
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
