const e = require('express');
const customerSchema = require('../mongoSchema/customerSchema');
const axios = require('axios');
const FormData = require('form-data');
var qs = require('qs');

const customerDataCapture = async (req, res) => {
    try {
        // customer request data format

        // var customer = [
        //     {
        //         "accountNumber": "LW122398",
        //         "fullName": "Akash Singh",
        //         "email": "akash@gmail.com"
        //     },
        //     { 
        //         "accountNumber": "2",
        //         "fullName": "Sam",
        //         "email": "sam@gmail.com"
        //     },
        //     {
        //         "accountNumber": "3",
        //         "fullName": "John",
        //         "email": "john@gmail.com"
        //     }
        // ];

        if (!req.body) {
            return res.json({
                'success': "false",
                'failure': {
                    'code': '4121107', // this code is represent if req.body is epmty , description : Object is missing
                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                    'message': 'Criteria not fulfilled to serve this request',
                    'description': 'Object is missing'
                }
            })
        }
        else if (!req.body.customer) {
            return res.json({
                'success': "false",
                'failure': {
                    'code': '4121108', // this code is represent if req.body.customer is epmty , description : customer is required.
                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                    'message': 'Criteria not fulfilled to serve this request',
                    'description': 'Customer is required'
                }
            })
        }
        else if (!Array.isArray(req.body.customer)) {  // check customers data in array object format
            return res.json({
                'success': "false",
                'failure': {
                    'code': '4121109', // this code is represent if req.body.customer is not array object format , description : Incorrect format of customer data                    .
                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                    'message': 'Criteria not fulfilled to serve this request',
                    'description': 'Incorrect format of customer data'
                }
            })
        }
        else {
            const checkCustomer = req.body.customer.length == 0 ? false : true;
            if (checkCustomer) {
                const checkCustomerData = [];
                req.body.customer.map(data => {
                    if (!data.accountNumber) {
                        checkCustomerData.push('false');
                    }
                    else if (!data.fullName) {
                        checkCustomerData.push('false');
                    }
                    else {
                        checkCustomerData.push('true');
                    }
                })
                const allEqual = checkCustomerData.every((val, i, arr) => val === arr[0]);
                const accountNumbers = [];
                req.body.customer.map(data => {
                    accountNumbers.push(data.accountNumber);
                })
                if (allEqual) { // if customer's have the  accountNumber and fullName data
                    customerSchema.find({ accountNumber: { $in: accountNumbers } }, (err, result) => {
                        if (err) {
                            return res.json({
                                'success': "false",
                                'failure': {
                                    'code': '4121103', // this code is represent if  mongo return error when find accountNumbers , description : Error found while find account number
                                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                                    'message': 'Criteria not fulfilled to serve this request',
                                    'description': 'Error found while find account number'
                                }
                            })
                        }
                        else if (result.length > 0) {
                            return res.json({
                                'success': "false",
                                'failure': {
                                    'code': '4121104', // this code is represent if accountNumber is exist in Db , description : Account number already exist
                                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                                    'message': 'Criteria not fulfilled to serve this request',
                                    'description': 'Account number already exist',
                                    'data': result
                                }
                            })
                        }
                        else {
                            customerSchema.insertMany(req.body.customer, (err, insertCustomer) => {
                                if (err) {
                                    return res.json({
                                        'success': "false",
                                        'failure': {
                                            'code': '4121105', // this code is represent if mongo return Error found while insert customer's data , description : Error found while insert customer's data
                                            'title': 'ERROR_CRITERIA_UNFULFILLED',
                                            'message': 'Criteria not fulfilled to serve this request',
                                            'description': "Error found while insert customer's data"
                                        }
                                    })
                                }
                                else {
                                    return res.json({
                                        'success': "true",
                                        'description': "Customer's data successfully saved / caputured"
                                    })
                                }
                            })
                        }
                    });
                }
                else {
                    return res.json({
                        'success': "false",
                        'failure': {
                            'code': '4121102', // this code is represent In case of customer have no data like accountNumber & fullName
                            'title': 'ERROR_CRITERIA_UNFULFILLED',
                            'message': 'Criteria not fulfilled to serve this request',
                            'description': 'Customer data is require : Account number / full name'
                        }
                    })
                }
            }
            else {
                return res.json({
                    'success': "false",
                    'failure': {
                        'code': '4121101', // this code is represent In case of non-receipt of customer data
                        'title': 'ERROR_CRITERIA_UNFULFILLED',
                        'message': 'Criteria not fulfilled to serve this request',
                        'description': 'Customer data is reqiured.'
                    }
                })
            }
        }
    }
    catch (error) {
        return res.json({
            'success': "false",
            'failure': {
                'code': '4121106', // this code is represent if error return in catch block
                'title': 'ERROR_CRITERIA_UNFULFILLED',
                'message': 'Criteria not fulfilled to serve this request',
                'description': '',
                'error': error
            }
        })
    }
};

const suspendAccount = async (req, res) => {
    try {
        const { suspendAccount, accountNumber, statusType } = req.body;
        if (!suspendAccount) {
            return res.json({
                'success': "false",
                'failure': {
                    'code': '41211010', // this code is represent if suspendAccount is empty
                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                    'message': 'Criteria not fulfilled to serve this request',
                    'description': 'SuspendAccount parameter is require'
                }
            })
        }
        else if (suspendAccount == 'indivisual') {  // suspendAccount == 'indivisual' if suspend of an indivisual account
            if (!accountNumber) {
                return res.json({
                    'success': "false",
                    'failure': {
                        'code': '41211011', // this code is represent if accountnumber is empty
                        'title': 'ERROR_CRITERIA_UNFULFILLED',
                        'message': 'Criteria not fulfilled to serve this request',
                        'description': 'Account number is require'
                    }
                })
            }
            else if (!statusType) {
                return res.json({
                    'success': "false",
                    'failure': {
                        'code': '41211011', // this code is represent if accountnumber is empty
                        'title': 'ERROR_CRITERIA_UNFULFILLED',
                        'message': 'Criteria not fulfilled to serve this request',
                        'description': 'Status type is require'
                    }
                })
            }
            else {
                console.log("accountNumber : ", accountNumber);
                customerSchema.findOne({ 'accountNumber': accountNumber }, async (err, customer) => {
                    console.log("customer:::::", customer);
                    if (err) {
                        return res.json({
                            'success': "false",
                            'failure': {
                                'code': '41211012',
                                'title': 'ERROR_CRITERIA_UNFULFILLED',
                                'message': 'Criteria not fulfilled to serve this request',
                                'description': 'Error found while check accountNumber is exist or not.'
                            }
                        })
                    }
                    else if (!customer) {
                        return res.json({
                            'success': "false",
                            'failure': {
                                'code': '41211013',
                                'title': 'ERROR_CRITERIA_UNFULFILLED',
                                'message': 'Criteria not fulfilled to serve this request',
                                'description': 'Customer not found.'
                            }
                        })
                    }
                    else {
                        // suspend account
                        const payload = JSON.stringify(
                            {
                                "accountNumber": accountNumber,
                                "statusType": statusType
                            });
                        var config = {
                            method: 'post',
                            url: 'https://scl-aol.cxos.tech/v1/cl/en/clx/account-workflows/status/suspend',
                            headers: {
                                'service-id': 'test',
                                'Content-Type': 'application/json'
                            },
                            data: payload
                        };
                        axios(config).then(function (response) {
                            customerSchema.updateOne({ 'accountNumber': accountNumber, $set: { 'statusType': statusType } }, (err, accountSuspend) => {
                                if (err) {
                                    return res.json({
                                        'success': "false",
                                        'failure': {
                                            'code': '41211013',
                                            'title': 'ERROR_CRITERIA_UNFULFILLED',
                                            'message': 'Criteria not fulfilled to serve this request',
                                            'description': 'Error found while account suspend'
                                        }
                                    })
                                }
                                else {
                                    return res.json({
                                        'success': "true",
                                        'description': 'Account suspended.'
                                    })
                                }
                            })
                        })
                            .catch(function (error) {
                                return res.json({
                                    'success': "false",
                                    'failure': {
                                        'code': '4121106', // this code is represent if error return in catch block
                                        'title': 'ERROR_CRITERIA_UNFULFILLED',
                                        'message': 'Criteria not fulfilled to serve this request',
                                        'description': '',
                                        'error': error
                                    }
                                })
                            });
                    }
                })
            }
        }
        else if (suspendAccount == 'all') {  // suspendAccount == 'all' if suspend all customer's account
            customerSchema.find({}, (err, customers) => {
                if (err) {
                    return res.json({
                        'success': "false",
                        'failure': {
                            'code': '41211012',
                            'title': 'ERROR_CRITERIA_UNFULFILLED',
                            'message': 'Criteria not fulfilled to serve this request',
                            'description': "Error found while get customer's data."
                        }
                    })
                }
                else if (customers.length == 0) {
                    return res.json({
                        'success': "false",
                        'failure': {
                            'code': '41211013',
                            'title': 'ERROR_CRITERIA_UNFULFILLED',
                            'message': 'Criteria not fulfilled to serve this request',
                            'description': 'Customer not found.'
                        }
                    })
                }
                else {
                    for (var i = 0; i < customers.length; i++) {
                        // suspend account
                        const payload = JSON.stringify(
                            {
                                "accountNumber": customers[i].accountNumber,
                                "statusType": customers[i].statusType
                            });
                        var config = {
                            method: 'post',
                            url: 'https://scl-aol.cxos.tech/v1/cl/en/clx/account-workflows/status/suspend',
                            headers: {
                                'service-id': 'test',
                                'Content-Type': 'application/json'
                            },
                            data: payload
                        };
                        axios(config).then(function (response) {
                            customerSchema.updateOne({ 'accountNumber': customers[i].accountNumber, $set: { 'statusType': statusType } }, (err, accountSuspend) => {
                                if (err) {
                                    console.log("error found while accout suspend");
                                }
                                else {
                                    console.log("accout suspended");

                                }
                            })
                        }).catch(function (error) {
                            console.log("error found.", err);

                        });
                    }
                    return res.json({
                        'success': "true",
                        'description': 'Account suspended.'
                    })
                }
            })
        }
        else {
            return res.json({
                'success': "false",
                'failure': {
                    'code': '41211011', // this code is represent if suspendAccount is wrong
                    'title': 'ERROR_CRITERIA_UNFULFILLED',
                    'message': 'Criteria not fulfilled to serve this request',
                    'description': 'Please provide correct value of suspendAccount value (indivisual / all)'
                }
            })
        }
    } catch (error) {
        return res.json({
            'success': "false",
            'failure': {
                'code': '4121106', // this code is represent if error return in catch block
                'title': 'ERROR_CRITERIA_UNFULFILLED',
                'message': 'Criteria not fulfilled to serve this request',
                'description': '',
                'error': error
            }
        })
    }
}
module.exports = {
    customerDataCapture,
    suspendAccount
}