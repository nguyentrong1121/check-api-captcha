import React, {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import {generateDeviceToken, generatePhoneModel, generateUUID, generateVietnameseName, sleep} from "../utils";

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
export default function CheatTaker() {
    const [state, setState] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [history, setHistory] = useState([])

    axios.defaults.headers = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*"
    }

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
                debugger
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
    const startAuthentication = async (state, headers, body) => {

        const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            redirect: "follow"
        };

        await retryFetch("https://api.taker.vn/v1/customers/authentication", requestOptions);
    };

// Login API call
    const loginUser = async (state, headers, body) => {
        delete body.address;
        delete body.fullName;
        delete body.platform;
        delete body.referralCode;
        const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            redirect: "follow"
        };

        return retryFetch("https://api.taker.vn/v1/customers/authentication/login", requestOptions);
    };

// Send SMS API call
    const sendSMS = async (state, headers) => {
        const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify({ phone: '0' + state }),
            redirect: "follow"
        };

        return retryFetch("https://api.taker.vn/v1/customers/authentication/send-sms", requestOptions);
    };

// Verify OTP API call
    const verifyOTP = async (userId, otp, headers) => {
        const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify({ userId, otp, isForgetPass: 0 }),
            redirect: "follow"
        };

        return retryFetch("https://api.taker.vn/v1/customers/authentication/verify-otp", requestOptions);
    };

// Main function
    const fetchStart = async () => {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            const { model, manufacturer, systemName } = generatePhoneModel();
            const body = {
                model,
                manufacturer,
                systemName,
                name: model,
                phone: '0' + state,
                address: "HN",
                fullName: generateVietnameseName(),
                password: "091121",
                referralCode: "0359530143",
                platform: systemName.toLowerCase(),
                deviceId: generateUUID(),
                deviceId2: generateDeviceToken(),
                memory: -1,
                deviceType: "Handset"
            }
            startAuthentication(state, myHeaders, body);
            await sleep(6000);

            const { data } = await loginUser(state, myHeaders, body);
            myHeaders.append("Authorization", `Bearer ${data.token}`);

            await sleep(8000);
            await sendSMS(state, myHeaders);

            while (true) {
                const otp = window.prompt('Nhập mã OTP');

                if (!otp) {
                    setLoading(false);
                    return;
                }

                await sleep(5000);
                const { data: verify } = await verifyOTP(data.user.id, otp, myHeaders);

                if (verify === true) {
                    alert('Thành công');
                    setLoading(false);
                    setHistory(prevState => [...prevState, state]);
                    return;
                }
            }
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
                placeholder="Số điện thoại"
                onChange={(evt) => setState(evt.target.value)}
            />
            <SubmitBtn onClick={fetchStart}>Start Cheat</SubmitBtn>
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item}-Done</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
