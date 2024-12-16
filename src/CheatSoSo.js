import React, {useState} from "react";
import styled from "styled-components";
import Loading from "react-fullscreen-loading";
import {getRandomNumber, sleep} from "./utils";

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
export default function CheatSoSo() {
    const [state, setState] = useState('NX2FXDX9');
    const [isLoading, setLoading] = useState(false);

// Retry logic for API calls
    const retryFetch = async (url, options, retries = 3, delay = 2000) => {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                const json = await response.json();
                if (!response.ok && json.message !== 'Phone number is existed') {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return json; // return the JSON response
            } catch (error) {
                lastError = error;
                if (i < retries - 1) {
                    await sleep(delay); // wait before retrying
                } else {
                    console.error('Max retries reached', lastError);
                    throw lastError;
                }
            }
        }
    };

// API call to start the process (login, make-call, etc.)
    const startOTP = async (mail) => {

        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                "password": "Tmd1eWVudHJvbmcx",
                "rePassword": "Tmd1eWVudHJvbmcx",
                "username": "NEW_USER_NAME_02",
                "email": mail,
            }),
            redirect: "follow",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
            }
        };

        await retryFetch("https://gw.sosovalue.com/usercenter/email/anno/sendRegisterVerifyCode/V2", requestOptions);
    };

// Verify OTP API call
    const verifyOTP = async (inbox, otp) => {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                "password": "Tmd1eWVudHJvbmcx",
                "rePassword": "Tmd1eWVudHJvbmcx",
                "username": "NEW_USER_NAME_02",
                "email": inbox,
                "verifyCode": otp,
                "invitationCode": state,
                "invitationFrom": null
            }),
            redirect: "follow",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
            }
        };

        return retryFetch("https://gw.sosovalue.com/usercenter/user/anno/v3/register", requestOptions);
    };

    // Generate mail using api
    const fetchEmail = async () => {
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            body: null
        }
        return retryFetch('https://mob2.temp-mail.org/mailbox', requestOptions);
    }

    // fetch message from mail
    const fetchMessageUntilExist = async (email) => {
        const requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: {
                authorization: email.token
            }
        }
        while (true) {
            const data = await retryFetch(`https://mob2.temp-mail.org/messages`, requestOptions);
            if (data?.messages?.[0]?.bodyPreview) {
                // call api to get detail message, then call api verify otp
                await sleep(5000)
                const regex = /\b\d{4,6}\b/g;
                const otp = data?.messages?.[0]?.bodyPreview.match(regex);
                return otp?.[0];
            }
            await sleep(8000);
        }
    }


// Main function
    const fetchStart = async () => {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            //get email
            const email = await fetchEmail();
            await startOTP(email?.mailbox);
            await sleep(8000)
            const otp = await fetchMessageUntilExist(email);
            await verifyOTP(email?.mailbox, otp);
            //sleep
            await sleep(getRandomNumber(1000, 10000));
            //repeat
            await fetchStart();
        } catch (error) {
            console.error("Error during the authentication process:", error);
            setLoading(false);
        }
    };



    return (
        <form className="App">
            <InputText
                style={{
                    marginTop: 10,
                    marginLeft: 0
                }}
                value={state}
                placeholder="Ref"
                onChange={(evt) => setState(evt.target.value)}
            />
            <SubmitBtn onClick={fetchStart}>Start Cheat</SubmitBtn>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
