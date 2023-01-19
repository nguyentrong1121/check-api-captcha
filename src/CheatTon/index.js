import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default () => {
    const url = 'https://api.ton.place/',
        feed = 'feed',
        comment = 'posts/new'

    const captchaRef = useRef(null);

    const [pagination, setPagination] = useState({
        "startFrom": 0,
        "section": "smart",
        "query": "",
        "page": 0,
        "feedUserId": 0
    });
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [isLoading, setLoading] = useState(false);
    const [auth, setAuth] = useState('');
    const [profileId, setProfileId] = useState('');
    const [token, setToken] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    axios.defaults.headers = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*"
    }

    useEffect(() => {
        if (pagination.page > 0) {
            callFeed()
        }
    }, [pagination.page])

    useEffect(() => {
        if (token) {
            fetchCreateUser(email.mailbox, email.token)
        }
    }, [token])

    useEffect(() => {
        if (authToken && authToken.length > 0) {
            fetchRegistration()
        }
    }, [authToken])

    useEffect(() => {
        if (accessToken && accessToken.length > 0) {
            follow()
        }
    }, [accessToken])

    const callFeed = () => {
        axios.post(url + feed, pagination, {
            headers: {
                'Authorization': auth
            }
        }).then(({data}) => {
            callComment(data.nextFrom, data.feed)
        })
    }

    const callComment = (next, feed, i = 0) => {
        if (feed.length - 1 < i) {
            setPagination(prevState => ({
                ...prevState,
                page: prevState.page + 1,
                startFrom: Number(next)
            }))
            return
        }
        axios.post(url + comment, {
            "parentId": feed[i].id,
            "replyTo": 0,
            "text": "follow chéo nha, follow back 100%",
            "attachments": [],
            "groupId": 0
        }, {
            headers: {
                'Authorization': auth
            }
        }).then(() => {
            setTimeout(() => callComment(next, feed, i + 1), 2000)
        }).catch(() => {
            setTimeout(() => callComment(next, feed, i), 300000)
        })
    }

    const reset = () => {
        setToken(null)
        setEmail({mailbox: '', token: ''})
        setAuthToken(null)
        captchaRef.current.reset();
        setTimeout(() => {
            fetchEmail()
        }, 1000)
    };

    const fetchEmail = () => {
        setLoading(true)
        let requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };
        fetch("https://mob2.temp-mail.org/mailbox", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.mailbox) {
                    setEmail({
                        ...result,
                        device: "chrome_" + Date.now(),
                    });
                    captchaRef.current.execute()
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
                reset()
            });
    }

    const fetchCreateUser = (mailbox, mailToken) => {
        setLoading(true)
        axios.post(url + 'auth/email',
            {
                "email": mailbox
            }, {
                headers: {
                    'g-recaptcha-action': 'action_' + Date.now(),
                    'g-recaptcha-token': token,
                    'g-recaptcha-version': 'V2',
                    'version': '7'
                }
            }).then(async response => {
            fetchMess(mailbox, mailToken);
        }).catch(error => {
            fetchEmail()
            setLoading(false)
        })
    }

    const fetchMess = (mailbox, mailtoken, i = 0) => {
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
                if (i > 10) {
                    fetchCreateUser(mailbox, mailtoken)
                    return
                }
                let regex = /\d+/g;
                if (result?.messages[0]?.bodyPreview) {
                    let string = result.messages[0].bodyPreview;
                    let matches = string.match(regex);
                    fetchVerify(matches[0].trim(), mailbox)
                } else {
                    //retry
                    fetchMess(mailbox, mailtoken, i + 1)
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error', error)
            });
    }

    const fetchVerify = (optCode, mailbox) => {
        setLoading(true)
        axios.post(url + 'auth/email/validate',
            {
                "email": mailbox,
                "code": optCode,
                "device": email.device,
            }, {
                headers: {
                    'version': '7'
                }
            }).then(response => {
            setAuthToken(response.data.access_token)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            // reset()
        })
    }

    const fetchRegistration = () => {
        setLoading(true)
        axios.get('https://randomuser.me/api/?nat=us').then(({data}) => {
            axios.post(url + 'registration',
                {
                    "first_name": data.results[0].name['first'],
                    "last_name": data.results[0].name['last'],
                    "sex": 0,
                    "country_id": 0,
                    "city_id": 0,
                    "photo_id": 0,
                    "bday": 0,
                    "bmonth": 0,
                    "byear": 0,
                    "utm": "",
                    "device": email.device,
                    "ref": null,
                    "targetId": 0
                }, {
                    headers: {
                        authorization: authToken
                    }
                }).then(({data}) => {
                console.log({
                    mail: email.mailbox,
                    status: 'ok'
                })
                setAccessToken(data.access_token)
            }).catch(error => {
                reset()
            })
        })
    }

    const follow = () => {
        axios.get('https://api.ton.place/profile/' + profileId, {
            headers: {
                'version': '7',
                'authorization': accessToken
            }
        }).then(({data}) => {
            axios.post(`https://api.ton.place/follow/${profileId}/add?recommended_authors=0`, {}, {
                headers: {
                    'authorization': accessToken,
                    'g-recaptcha-action': 'action_' + Date.now(),
                    'g-recaptcha-token': token,
                    'g-recaptcha-version': 'V2',
                    'version': '7'
                }
            }).then(() => {
                like(data.posts)
            })
        })
    }

    const like = (feed, i = 0) => {
        if (feed.length - 1 < i) {
            reset()
        }
        axios.post(url + `likes/${feed[i].id}/post/add`, {}, {
            headers: {
                'version': '7',
                'authorization': accessToken
            }
        }).then(() => {
            setTimeout(() => like(feed, i + 1), 1000)
        }).catch(() => {
            setTimeout(() => like(feed, i + 1), 1000)
        })
    }

    return <div>
        <input placeholder={'token'} value={auth} onChange={event => setAuth(event.target.value)}/>
        <input placeholder={'id'} value={profileId} onChange={event => setProfileId(event.target.value)}/>
        <button onClick={callFeed} style={{margin: 10}}><p>spam</p></button>
        <button onClick={fetchEmail} style={{margin: 10}}><p>follow</p></button>
        <ReCAPTCHA
            ref={captchaRef}
            onChange={setToken}
            onErrored={reset}
            // onExpired={reset}
            size={'invisible'}
            sitekey={'6LcsGwgkAAAAAE-7c9qKHONOaQwoUsxMwSPDsAD1'}
        />
    </div>
}
