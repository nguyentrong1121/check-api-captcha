import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";

var bu = require("crypto-js");


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
export default function CheatBytebeat() {
    let intervalId = null;
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [sleep, setSleep] = useState(5000);
    const [authToken, setAuthToken] = useState(null);
    const [refCode, setReftCode] = useState(null);
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

    const onVerify = async () => {
        if (authToken && authToken.length > 0) {
            await axios.post('https://api.bytebeat.vip/api/user/level_unlock', {
                "id": 2
            }, {
                headers: {
                    authorization: 'Bearer ' + authToken
                }
            })
            await fetchCheckin();
        }
    };

    const fetchCheckin = async () => {
        setLoading(true)
        const {data: lstVideo} = await axios.get(`https://api.bytebeat.vip/api/task/video_list?d=${new Date().getTime()}&page=1&limit=100`, {
            headers: {
                authorization: 'Bearer ' + authToken
            }
        })

        await axios.post('https://api.bytebeat.vip/api/task/do_task', {
            "video_id": lstVideo.data[0].id,
            "score": 5,
            "level": "1",
            "task_id": ""
        }, {
            headers: {
                authorization: 'Bearer ' + authToken
            }
        })
        const {data: user} = await axios.get('https://api.bytebeat.vip/api/user/user_info?d=' + new Date().getTime(), {
            headers: {
                authorization: 'Bearer ' + authToken
            }
        })
        setHistory(prevState => [...prevState, {
            mailbox: email.mailbox,
            balance: user.data.total_money,
            watched: lstVideo.data[0].id,
            status: 1,
        }])
        axios.post(db, {
            mailbox: email.mailbox,
            watched: lstVideo.data[0].id,
            balance: user.data.total_money,
        }, {headers: {'Content-Type': 'application/json'}})
        reset()
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


    const fetchCreateUser = (mailbox) => {
        setLoading(true)
        axios.post('https://api.bytebeat.vip/api/user/register?lang=vi',
            {
                "account": mailbox,
                "pwd": "940289dda3df035b9edb74a11e012aff",
                "user_type": 1,
                "code": "266859",
                "safety_pwd": "940289dda3df035b9edb74a11e012aff",
                "ws": "",
                "te": "",
                "email_code": ""
            }).then(async response => {
                if(response?.data.status === 400){
                    await wait(sleep)
                    fetchCreateUser(mailbox)
                    return
                }
                setAuthToken(response?.data?.data?.token)
        }).catch(error => {
            fetchEmail()
            setLoading(false)
        })
    }

    const fetchBatchCheckin = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        for (let i = 0; i < lstAccount.length; i++) {
            const {data: loginRes} = await axios.post('https://api.bytebeat.vip/api/user/login?lang=vi',
                {
                    "account": lstAccount[i].mailbox,
                    "pwd": "940289dda3df035b9edb74a11e012aff",
                    "code": ""
                })
            const {data: lstVideo} = await axios.get(`https://api.bytebeat.vip/api/task/video_list?d=${new Date().getTime()}&page=1&limit=100`, {
                headers: {
                    authorization: 'Bearer ' + loginRes.data.token
                }
            })
            const newVideo = lstVideo.data.find(item => !lstAccount[i].watched.split(';').some(val=>val === item.id))
            await axios.post('https://api.bytebeat.vip/api/task/do_task', {
                "video_id": newVideo.id,
                "score": 5,
                "level": "1",
                "task_id": ""
            }, {
                headers: {
                    authorization: 'Bearer ' + loginRes.data.token
                }
            })
            const {data: user} = await axios.get('https://api.bytebeat.vip/api/user/user_info?d=' + new Date().getTime(), {
                headers: {
                    authorization: 'Bearer ' + loginRes.data.token
                }
            })

            await axios.put(db + '/' + i, {
                ...lstAccount[i],
                watched: lstAccount[i].watched + ';' + newVideo.id,
                balance: user.data.total_money,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            await wait(sleep)
        }
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
        if (refCode) {
            localStorage.setItem("REFCODE", JSON.stringify(refCode))
        }
    }, [refCode])

    useEffect(() => {
        if (history) {
            localStorage.setItem("HISTORY", JSON.stringify(history))
        }
    }, [history])

    useEffect(() => {
        const ref = localStorage.getItem("REFCODE")
        if (!refCode) {
            if (JSON.parse(ref) != null) {
                setReftCode(JSON.parse(ref))
            }
        }
    }, [])

    return (
        <form className="App">
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
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item?.mail}-{item?.status === 1 ? 'Done' : 'FAILS'}</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
