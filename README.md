## Prerequisites
 - Install following packages on local:
    - node -> v8.11.1
    - mongo -> v5.0.6


    API =>

    [1]. 
    URL => http://localhost:2000/api/customerDataCapture
    MEthod : POST
    request => 
    {
    "customer": [
        {
            "accountNumber": "LW100052634",
            "fullName": "Akash Singh",
            "email": "akash@gmail.com"
        }
    ]
}

Resposne =>
{
    "success": "true",
    "description": "Customer's data successfully saved / caputured"
}

[2]. Account Suspend

URL : http://localhost:2000/api/suspendAccount
Method : POST


case [1]. If indivisual account suspend

Request : 

{
    "accountNumber": "LW100052634",
    "statusType": "suspend_fraud_investigation",
    "suspendAccount":"indivisual"
}

Response =>
                    {
                        'success': "true",
                        'description': 'Account suspended.'
                    }

case [2]. If all account suspend


request =>

{
    "statusType": "suspend_fraud_investigation",
    "suspendAccount":"all"
}

Response =>
                    {
                        'success': "true",
                        'description': 'Account suspended.'
                    }
