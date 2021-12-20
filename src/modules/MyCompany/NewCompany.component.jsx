import React from "react";
import {HelmetComponent} from "../common/Helmet/Helmet.component";
import {Header} from "../common/Header/Header.component";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {TextInput} from "../common/Formik/textInput.component";
import {useAuth0} from "@auth0/auth0-react";
import {api} from "../api/api.service";

export const NewCompany = ({onButton}) => {

    const {user, logout} = useAuth0();

    const addNewCompanyAndTeamMember = async (values) => {
        let today = new Date()
        let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
        let bodyCompany = {
            CompanyName: values.companyName,
            JoinDate: date
        }

        let responseCompany = await api.post(`companies`, bodyCompany)
        console.log(responseCompany)

        let bodyTeamMember = {
            FirstName: values.firstName,
            LastName: values.lastName,
            Title: "Manager",
            Mail: user.email,
            Subject: user.sub,
            CompanyId: responseCompany.data.companyId
        }
        let responseTeamMember = await api.post(`companies/${responseCompany.data.companyId}/team-members`, bodyTeamMember)
        onButton(true)
        console.log(responseTeamMember)

    }

    const onSubmit = (values, {setSubmitting}) => {
        setTimeout(() => {
            addNewCompanyAndTeamMember(values).then(r => console.log(r))
            setSubmitting(false);
        }, 400);
    }
    return (
        <>
            <HelmetComponent title="New Company"/>
            <Header>
                <div>
                    <h1 className="header-title">New Company</h1>
                </div>
            </Header>
            <div className="new-company container p-5 align-content-center">
                <div className="col-md-12 p-0">
                    <div className="page-title">
                        <h2>Registration form</h2>
                        <p>Register your company to be able to track your team's reports</p>
                    </div>
                    <div className="page-section">
                        <div className="title border-bottom">Registration new company</div>

                        <Formik
                            initialValues={{
                                companyName: '',
                                firstName: '',
                                lastName: ''
                            }}

                            validationSchema={Yup.object({
                                companyName: Yup.string()
                                    .max(100, 'Must be 100 characters or less')
                                    .required('Required'),
                                firstName: Yup.string()
                                    .max(20, 'Must be 20 characters or less')
                                    .required('Required'),
                                lastName: Yup.string()
                                    .max(20, 'Must be 20 characters or less')
                                    .required('Required'),
                            })}

                            onSubmit={onSubmit}
                        >
                            {({isSubmitting}) => (
                                <Form className="col-md-4">
                                    <TextInput
                                        label="Enter your Company Name"
                                        name="companyName"
                                        type="text"
                                        placeholder=""
                                    />
                                    <TextInput
                                        label="Enter your First Name"
                                        name="firstName"
                                        type="text"
                                        placeholder=""
                                    />
                                    <TextInput
                                        label="Enter your Last Name"
                                        name="lastName"
                                        type="text"
                                        placeholder=""
                                    />
                                    <div className="form-group">
                                        <button
                                            disabled={isSubmitting} type="submit"
                                            className="btn btn-outline-dark border-2 shadow-none"
                                        >Register
                                        </button>
                                        <button
                                            onClick={() => logout({returnTo: window.location.origin,})}
                                            type="button"
                                            className="ms-5 btn btn-outline-dark border-2 shadow-none"
                                        >Log Out
                                        </button>


                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}