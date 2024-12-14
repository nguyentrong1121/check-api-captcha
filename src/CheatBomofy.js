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
export default function CheatBomofy() {
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

    const onVerify = () => {
        if (authToken && authToken.length > 0) {
            fetchCheckin();
        }
    };

    const fetchCheckin = () => {
        setLoading(true)
        axios.get('https://api.bomofy-ai.com/api/quan/start?rts=' + new Date().getTime(), {
            headers: {
                token: 'Bearer ' + authToken
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

    const fetchLogin = () => {
        setLoading(true)
        axios.post('https://api.bomofy-ai.com/api/login',
            {
                "a": email.mailbox,
                "p": "940289dda3df035b9edb74a11e012aff",
                "c": ""
            }).then(response => {
            const p = bu.enc.Hex.parse(bu.SHA256('sl236cl929ki829is0c44928q12ce9ue6').toString())
                , M = bu.enc.Base64.parse(response.data)
                , o = bu.lib.WordArray.create(M.words.slice(0, 4))
                , t = bu.lib.WordArray.create(M.words.slice(4))
                , z = bu.AES.decrypt({
                ciphertext: t
            }, p, {
                iv: o,
                mode: bu.mode.CBC,
                padding: bu.pad.Pkcs7
            }).toString(bu.enc.Utf8);
            const decrypt = JSON.parse(z)
            setAuthToken(decrypt.data.t)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            reset()
        })
    }


    const fetchCreateUser = (mailbox) => {
        setLoading(true)
        axios.post('https://api.bomofy-ai.com/api/register',
            {
                "a": mailbox,
                "p": "940289dda3df035b9edb74a11e012aff",
                "sp": "940289dda3df035b9edb74a11e012aff",
                "ut": 1,
                "c": "399463",
                "em": mailbox,
                "contact_info": "",
                "em_co": "",
                "tg": "",
                "whs": "",
                "captcha": "",
                "phone_area_code": "+1"
            }).then(async response => {
            fetchLogin();
        }).catch(error => {
            fetchEmail()
            setLoading(false)
        })
    }

    const fetchBatchCheckin = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        for (let i = 0; i < lstAccount.length; i++) {
            const {data: encryptData} = await axios.post('https://api.bomofy-ai.com/api/login',
                {
                    "a": lstAccount[i].mailbox,
                    "p": "940289dda3df035b9edb74a11e012aff",
                    "c": ""
                })
            const p = bu.enc.Hex.parse(bu.SHA256('sl236cl929ki829is0c44928q12ce9ue6').toString())
                , M = bu.enc.Base64.parse(encryptData)
                , o = bu.lib.WordArray.create(M.words.slice(0, 4))
                , t = bu.lib.WordArray.create(M.words.slice(4))
                , z = bu.AES.decrypt({
                ciphertext: t
            }, p, {
                iv: o,
                mode: bu.mode.CBC,
                padding: bu.pad.Pkcs7
            }).toString(bu.enc.Utf8);
            const decrypt = JSON.parse(z)
            await axios.get('https://api.bomofy-ai.com/api/quan/start?rts=' + new Date().getTime(), {
                headers: {
                    token: 'Bearer ' + decrypt.data.t
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
                    marginLeft: 0
                }}
                type="refCode"
                value={refCode}
                placeholder="Ref Code"
                onChange={(evt) => setReftCode(evt.target.value)}
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
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item?.mail}-{item?.status === 1 ? 'Done' : 'FAILS'}</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
