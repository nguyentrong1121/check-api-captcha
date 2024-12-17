import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import {generateRandomEmail, getRandomNumber} from "./utils";

var CryptoJS = require("crypto-js");

const db = 'https://api.sheetbest.com/sheets/6d1c7267-1e81-4bdd-a317-dda538bf4553'
const SubmitBtn = styled.div`
  width: 100px;
  height: 30px;
  border-radius: 2px;
  background-color: #f3f3f3;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #d0d0d0;
  }
`;
const InputText = styled.input`
  height: 40px;
  border: none;
  border-radius: 2px;
  background-color: #f3f3f3;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  margin: 4px auto;
  margin-top: 10px;
  margin-left: 10px;
`
export default function CheatBunny() {
    let intervalId = null;
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [sleep, setSleep] = useState(5000);
    const [authToken, setAuthToken] = useState(null);
    const [mailbox, setMailbox] = useState(null);
    const [ref, setRef] = useState('J4PR8JA');
    const [isLoading, setLoading] = useState(false);
    const [history, setHistory] = useState([])

    axios.defaults.headers = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*"
    }

    const reset = () => {
        setEmail({mailbox: '', token: ''})
        setAuthToken(null)
        setTimeout(() => {
            fetchVerify()
        }, getRandomNumber(6000, 120000))
    };

    const onVerify = () => {
        if (authToken) {
            fetchCheckin();
        }
    };

    const fetchCheckin = async () => {
        setLoading(true)
        await axios.post('https://bunnycontract.com/api/activity/draw-create',
            {
                "e": "Xh37xudBp6q6jrM45yJuhw=="
            }, {headers: {'Content-Type': 'application/json', ...getHeaderParams(authToken?.['auth_info'], authToken?.['user_info'])}})
        axios.get('https://bunnycontract.com/api/sign-in/score-create', {headers: {'Content-Type': 'application/json', ...getHeaderParams(authToken?.['auth_info'], authToken?.['user_info'])}})
        let {data: userLevel} = await axios.get('https://bunnycontract.com/api/user-level/info', {headers: {'Content-Type': 'application/json', ...getHeaderParams(authToken?.['auth_info'], authToken?.['user_info'])}})
        userLevel = decrypt(userLevel?.['e'])
        const diff = userLevel?.['total_times'] - userLevel?.['over_times']
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                await axios.post('https://bunnycontract.com/api/user-level/make',
                    {
                        "e": "Xh37xudBp6q6jrM45yJuhw=="
                    }, {headers: {'Content-Type': 'application/json', ...getHeaderParams(authToken?.['auth_info'], authToken?.['user_info'])}})
            }
        }
        let {data: user} = await axios.get('https://bunnycontract.com/api/user/info', {headers: {'Content-Type': 'application/json', ...getHeaderParams(authToken?.['auth_info'], authToken?.['user_info'])}})
        user = decrypt(user?.['e'])
        setHistory(prevState => [...prevState, {
            mailbox: email.mailbox,
            balance: user?.['user_info']?.['score_balance'],
        }])
        axios.post(db, {
            mailbox: email.mailbox,
            authInfo: authToken?.['auth_info'],
            uid: authToken?.['user_info']?.['uid'],
            balance: user?.['user_info']?.['score_balance'],
        }, {headers: {'Content-Type': 'application/json'}})
        reset()
    }

    const fetchVerify = () => {
        setLoading(true)
        const randomEmail = generateRandomEmail(['gmail.com'])
        setEmail({mailbox: randomEmail, token: ''})
        const data = {
            "code": "",
            "email_code": "",
            "referrer_code": ref,
            "email": randomEmail,
            "login_pwd": "Nguyentrong1",
            "login_pwd_confirm": "Nguyentrong1"
        }
        axios.post('https://bunnycontract.com/common/user/register-by-email',
            {
                e: encrypt(data)
            }, {headers: {'Content-Type': 'application/json', ...getHeaderParams()}}).then(response => {
                const res = decrypt(response.data.e)
                if(res?.error){
                    throw new Error(res?.error)
                }
            setAuthToken(res)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            reset()
        })
    }

    const fetchBatchCheckin = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        for (let i = 0; i < lstAccount.length; i++) {
            const response = await axios.post('https://www.luckytimipro.com/api/user/login',
                {
                    "email": lstAccount[i].mailbox,
                    "userName": "",
                    "phone": "",
                    "password": lstAccount[i].password,
                    "loginType": 2
                })
            await axios.post('https://www.luckytimipro.com/api/user/sign',
                {}, {
                    headers: {
                        token: response.data.data.token
                    }
                })
            const {data: info} = await axios.get('https://www.luckytimipro.com/api/user/sign/info', {
                headers: {
                    token: response.data.data.token
                }
            })
            await axios.put(db + '/' + i, {
                ...lstAccount[i],
                checkin: info?.data?.continuityDays,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    token: response.data.data.token
                }
            })
            await wait(sleep)
        }
    }

    const fetchUpdateData = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        for (let i = 0; i < lstAccount.length; i++) {
            const response = await axios.post('https://www.luckytimipro.com/api/user/login',
                {
                    "email": lstAccount[i].mailbox,
                    "userName": "",
                    "phone": "",
                    "password": lstAccount[i].password,
                    "loginType": 2
                })
            const {data: usdt} = await axios.post('https://www.luckytimipro.com/api/user/wallet/getUsdt',
                {}, {
                    headers: {
                        token: response.data.data.token
                    }
                })
            const {data: info} = await axios.get('https://www.luckytimipro.com/api/user/current/get', {
                headers: {
                    token: response.data.data.token
                }
            })
            const {data: infoClaim} = await axios.get('https://www.luckytimipro.com/api/user/sign/info', {
                headers: {
                    token: response.data.data.token
                }
            })
            if (infoClaim?.data?.awardCurrent === 5) {
                await axios.post('https://www.luckytimipro.com/api/user/sign/receive', {
                    "amount": 5
                }, {
                    headers: {
                        token: response.data.data.token
                    }
                })
            }
            const {data: orderInfo} = await axios.post('https://www.luckytimipro.com/api/user/withdraw/pagelist?pageNum=1&pageSize=3&page_no=1&page_size=3', {}, {
                headers: {
                    token: response.data.data.token
                }
            })
            const status = {
                '1': 'Thành công',
                '0': 'Chờ xử lý',
            }
            const order = orderInfo?.data?.[0]
            await axios.put(db + '/' + i, {
                ...lstAccount[i],
                balance: usdt?.data?.money,
                UID: info?.data?.usercode,
                status: status?.[order?.state.toString()],
                bank: order?.to
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    token: response.data.data.token
                }
            })
            await wait(sleep)
        }
    }

    const fetchUpdateDataSingle = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        lstAccount.map(async (currentData, i) => {
            if (currentData.mailbox === mailbox) {
                const response = await axios.post('https://www.luckytimipro.com/api/user/login',
                    {
                        "email": currentData.mailbox,
                        "userName": "",
                        "phone": "",
                        "password": currentData.password,
                        "loginType": 2
                    })
                const {data: usdt} = await axios.post('https://www.luckytimipro.com/api/user/wallet/getUsdt',
                    {}, {
                        headers: {
                            token: response.data.data.token
                        }
                    })
                const {data: info} = await axios.get('https://www.luckytimipro.com/api/user/current/get', {
                    headers: {
                        token: response.data.data.token
                    }
                })
                const {data: infoClaim} = await axios.get('https://www.luckytimipro.com/api/user/sign/info', {
                    headers: {
                        token: response.data.data.token
                    }
                })
                if (infoClaim?.data?.awardCurrent === 30) {
                    await axios.post('https://www.luckytimipro.com/api/user/sign/receive', {
                        "amount": 15
                    }, {
                        headers: {
                            token: response.data.data.token
                        }
                    })
                }
                const {data: orderInfo} = await axios.post('https://www.luckytimipro.com/api/user/withdraw/pagelist?pageNum=1&pageSize=3&page_no=1&page_size=3', {}, {
                    headers: {
                        token: response.data.data.token
                    }
                })
                const status = {
                    '1': 'Thành công',
                    '0': 'Chờ xử lý',
                }
                const order = orderInfo?.data?.[0]
                await axios.put(db + '/' + i, {
                    ...currentData,
                    balance: usdt?.data?.money,
                    UID: info?.data?.usercode,
                    status: status?.[order?.state.toString()],
                    bank: order?.to
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        token: response.data.data.token
                    }
                })
            }
        })
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const encrypt = (data) => {
        let key = CryptoJS.enc.Utf8.parse('J8gD4uKpT2rV9ZbQ');
        let iv = CryptoJS.enc.Utf8.parse('L1hW7gFqP3kM0VbY');
        data = typeof data != 'string' ? JSON.stringify(data) : data;
        let encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let str = encrypted.toString();
        return str;
    }
    const decrypt = (str) => {
        let key = CryptoJS.enc.Utf8.parse('J8gD4uKpT2rV9ZbQ');
        let iv = CryptoJS.enc.Utf8.parse('L1hW7gFqP3kM0VbY');
        let data = CryptoJS.AES.decrypt(str, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        data = data.toString((CryptoJS.enc.Utf8));
        try {
            data = JSON.parse(data);
        } catch (error) {
        }
        console.log(data)
        return data;
    }

    var getHeaderParams = (authInfo = '', userInfo = '') => {
        let auth_info = authInfo;
        let user_info = userInfo;
        let device_id = '';
        let time = new Date().getTime();
        let info = {
            uid: user_info && user_info.uid ? user_info.uid : '',
            token: auth_info || '',
            time: time,
        };
        return {
            authorization: encrypt(info),
            time: time,
            lang: 'en',
            device: device_id || '',
        };
    }
    // useEffect(() => {
    //     if (!token) {
    //         // Token is set, can submit here
    //         fetchEmail()
    //     }
    // }, [token]);

    useEffect(() => {
        if (authToken) {
            onVerify()
            clearInterval(intervalId);
            clearTimeout();
        }
    }, [authToken])

    useEffect(() => {
        if (mailbox) {
            localStorage.setItem("MAILBOX", JSON.stringify(mailbox))
        }
    }, [mailbox])

    useEffect(() => {
        if (history) {
            localStorage.setItem("HISTORY", JSON.stringify(history))
        }
    }, [history])

    useEffect(() => {
        const ref = localStorage.getItem("MAILBOX")
        if (!mailbox) {
            if (JSON.parse(ref) != null) {
                setMailbox(JSON.parse(ref))
            }
        }
    }, [])

    return (
        <form className="App">
            <InputText
                style={{
                    marginTop: 10,
                    marginLeft: 0
                }}
                value={ref}
                placeholder="Ref"
                onChange={(evt) => setRef(evt.target.value)}
            />
            <InputText
                style={{
                    marginTop: 10,
                    marginLeft: 10
                }}
                type="refCode"
                value={sleep}
                placeholder="Thời gian chờ"
                onChange={(evt) => setSleep(evt.target.value)}
            />
            <SubmitBtn onClick={fetchVerify}>Start Cheat</SubmitBtn>
            <SubmitBtn onClick={fetchBatchCheckin}>Batch Checkin</SubmitBtn>
            <SubmitBtn onClick={fetchUpdateDataSingle}>Single Update</SubmitBtn>
            <SubmitBtn onClick={fetchUpdateData}>Batch Update</SubmitBtn>
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item?.mail}-{item?.status === 1 ? 'Done' : 'FAILS'}</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
