import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import bu from "crypto-js";

const db = 'https://api.sheetbest.com/sheets/23d09ca3-de8d-4d86-837e-0a168d731d2d'
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
export default function CheatPrimal() {
    let intervalId = null;
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [sleep, setSleep] = useState(5000);
    const [authToken, setAuthToken] = useState(null);
    const [mailbox, setMailbox] = useState(null);
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
            fetchEmail()
        }, sleep)
    };

    const onVerify = () => {
        if (authToken && authToken.length > 0) {
            fetchCheckin();
        }
    };

    const fetchCheckin = () => {
        setLoading(true)
        axios.post('https://www.luckytimipro.com/api/user/sign',
            {}, {
                headers: {
                    token: authToken
                }
            }).then(response => {
            setHistory(prevState => [...prevState, {
                mailbox: email.mailbox,
                password: 'Nguyentrong1',
                checkin: 1,
                status: 1,
            }])
            axios.post(db, {
                mailbox: email.mailbox,
                password: 'Nguyentrong1',
                checkin: 1,
            }, {headers: {'Content-Type': 'application/json'}})
            reset()
        }).catch(error => {
            reset()
        })
    }

    const fetchMess = (mailbox) => {
        let myHeaders = new Headers();
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };
        fetch(`https://api.internal.temp-mail.io/api/v3/email/${mailbox}/messages`, requestOptions)
            .then(response => response.json())
            .then(async result => {
                let regex = /\d+/g;
                if (result[0]) {
                    let string = result[0].body_text;
                    let matches = string.match(regex);
                    fetchVerify(matches[0].trim())
                } else {
                    //retry
                    setTimeout(() => {
                        fetchMess(mailbox)
                    }, 3000)
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error', error)
            });
    }

    const fetchEmail = () => {
        setLoading(true)
        let requestOptions = {
            method: 'POST',
            redirect: 'follow',
            data: JSON.stringify({
                "min_name_length": 10,
                "max_name_length": 10
            })
        };
        fetch("https://api.internal.temp-mail.io/api/v3/email/new", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    setEmail({
                        mailbox: result.email,
                        token: result.token
                    });
                    setLoading(false)
                } else {
                    fetchEmail();
                }
            })
            .catch(error => {
                setLoading(false)
                reset()
            });

    }

    const fetchVerify = (optCode) => {
        setLoading(true)
        axios.post('https://www.luckytimipro.com/api/user/buyer/register',
            {
                "username": "",
                "password": "Nguyentrong1",
                "rePassword": "Nguyentrong1",
                "phone": "",
                "email": email.mailbox,
                "type": 2,
                "verifCode": optCode.toString(),
                "profession": "Student",
                "userCode": "",
                "agentCode": "U139585",
                "checkMode": 3
            }).then(response => {
            setAuthToken(response.data.data.token)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            reset()
        })
    }


    const fetchCreateUser = (mailbox) => {
        setLoading(true)
        axios.post('https://www.luckytimipro.com/api/user/sendCaptchCodeNoneLogin?target=' + mailbox,
            {}).then(async response => {
            fetchMess(mailbox);
        }).catch(error => {
            fetchEmail()
            setLoading(false)
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

    // useEffect(() => {
    //     if (!token) {
    //         // Token is set, can submit here
    //         fetchEmail()
    //     }
    // }, [token]);

    useEffect(() => {
        if (email.mailbox && email.token) {
            fetchCreateUser(email.mailbox)
        }
    }, [email])

    useEffect(() => {
        if (authToken && authToken.length > 0) {
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
                value={mailbox}
                placeholder="Mailbox"
                onChange={(evt) => setMailbox(evt.target.value)}
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
            <SubmitBtn onClick={fetchEmail}>Start Cheat</SubmitBtn>
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
