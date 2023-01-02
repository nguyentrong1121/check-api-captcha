import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";

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
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [sleep, setSleep] = useState(1000);
    const [otp, setOtp] = useState("");
    const [authToken, setAuthToken] = useState(null);
    const [refCode, setReftCode] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const captchaRef = useRef(null);
    const [history, setHistory] = useState([])

    axios.defaults.headers = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*"
    }

    const onSubmit = () => {
        captchaRef.current.execute();
    };

    const onExpire = () => {
        console.log("hCaptcha Token Expired");
    };

    const onVerify = () => {
        if (authToken && authToken.length > 0) {
            fetchSetRef();
        }
    };

    const onError = (err) => {
        console.log(`hCaptcha Error: ${err}`);
    };

    const fetchSetRef = () => {
        setLoading(true)
        axios.post('https://byrjycocvluocdgliyvg.supabase.co/rest/v1/rpc/set_referred_by',
            {
                "code": refCode
            }, {
                headers: {
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cmp5Y29jdmx1b2NkZ2xpeXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc0MDY3NzksImV4cCI6MTk4Mjk4Mjc3OX0.SLAgTxtgawJoxTXXtxfI85Q3Xz-ecBI9XkjZyKvl794",
                    authorization: "Bearer " + authToken
                }
            }).then(response => {
            setHistory(prevState => [...prevState, {
                mail: email.mailbox,
                status: 1
            }])
            setToken(null)
            setEmail({mailbox: '', token: ''})
            setAuthToken(null)
            captchaRef.current.resetCaptcha();
            setTimeout(() => {
                fetchEmail()
            }, sleep)
        }).catch(error => {
            setLoading(false)
        })
    }

    const fetchMess = (mailbox, mailtoken) => {
        let myHeaders = new Headers();
        myHeaders.append("authorization", mailtoken);
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch("https://mob2.temp-mail.org/messages", requestOptions)
            .then(response => response.json())
            .then(result => {
                let regex = /\d+/g;
                if (result?.messages[0]?.bodyPreview) {
                    let string = result.messages[0].bodyPreview;
                    let matches = string.match(regex);
                    fetchVerify(matches[0].trim(), mailbox)
                } else {
                    //retry
                    fetchMess(mailbox, mailtoken)
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
            redirect: 'follow'
        };
        fetch("https://mob2.temp-mail.org/mailbox", requestOptions)
            .then(response => response.json())
            .then(result => {
                let regex = /\d+/g;
                let hasNum = result.mailbox.match(regex)
                if (result.mailbox) {
                    if (hasNum.length > 5) {
                        fetchEmail();
                    } else {
                        setEmail(result);
                        captchaRef.current.execute();
                        setLoading(false)
                    }
                } else {
                    fetchEmail();
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error', error)
            });

    }

    const fetchVerify = (optCode, mailbox) => {
        setLoading(true)
        axios.post('https://byrjycocvluocdgliyvg.supabase.co/auth/v1/verify',
            {
                "email": mailbox,
                "token": optCode,
                "type": "signup",
                "gotrue_meta_security": {}
            }, {
                headers: {
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cmp5Y29jdmx1b2NkZ2xpeXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc0MDY3NzksImV4cCI6MTk4Mjk4Mjc3OX0.SLAgTxtgawJoxTXXtxfI85Q3Xz-ecBI9XkjZyKvl794"
                }
            }).then(response => {
            setAuthToken(response.data.access_token)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
        })
    }


    const fetchCreateUser = (mailbox, mailToken) => {
        setLoading(true)
        axios.post('https://byrjycocvluocdgliyvg.supabase.co/auth/v1/otp',
            {
                "email": mailbox,
                "data": {},
                "create_user": true,
                "gotrue_meta_security": {
                    "captcha_token": token
                }
            }, {
                headers: {
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cmp5Y29jdmx1b2NkZ2xpeXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc0MDY3NzksImV4cCI6MTk4Mjk4Mjc3OX0.SLAgTxtgawJoxTXXtxfI85Q3Xz-ecBI9XkjZyKvl794"
                }
            }).then(async response => {
            fetchMess(mailbox, mailToken);
        }).catch(error => {
            fetchEmail()
            setLoading(false)
        })
    }

    // useEffect(() => {
    //     if (!token) {
    //         // Token is set, can submit here
    //         fetchEmail()
    //     }
    // }, [token]);

    useEffect(()=>{
        if(token){
            fetchCreateUser(email.mailbox, email.token)
        }
    },[token])

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
    //royere3458@sirafee.com
    const onTestEmail = () => {
        var requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };

        fetch("https://mob2.temp-mail.org/mailbox", requestOptions)
            .then(response => response.json())
            .then(result => {
                let myHeaders = new Headers();
                myHeaders.append("authorization", result.token);
                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                fetch("https://mob2.temp-mail.org/messages", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        let regex = /\d+/g;
                        if (result?.messages[0]?.bodyPreview) {
                            let string = result.messages[0].bodyPreview;
                            let matches = string.match(regex);
                            fetchVerify(matches[0].trim())
                        }
                    })
                    .catch(error => {
                        setLoading(false)
                        console.log('error', error)
                    });
            })
            .catch(error => console.log('error', error));
    }
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
            <HCaptcha
                // This is testing sitekey, will autopass
                // Make sure to replace
                sitekey="c4344dc0-0182-431f-903c-d8f53065d81d"
                onVerify={setToken}
                onError={onError}
                onExpire={onExpire}
                ref={captchaRef}
            />
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item?.mail}-{item?.status === 1 ? 'Done' : 'FAILS'}</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
