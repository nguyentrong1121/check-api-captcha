import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import axios from "axios";
import moment from "moment";

function App() {
    const [input, setInput] = useState('')
    const [accounts, setAccouts] = useState([]);
    const check = async () => {
        try {
            let temp = JSON.parse(input)
            if (accounts) {
                let lstAcc = await Promise.all(temp.map(async i => {
                    let headers = {
                        apikey: i.apikey,
                        uid: i.uid
                    }
                    const response = await axios.get('https://free.nocaptchaai.com/api/account/balance', {
                        headers
                    });
                    return {
                        ...response.data,
                        ...i
                    }
                }))
                setAccouts(lstAcc)
            } else {
                alert('Danh sách ít quá')
            }
        } catch (e) {
            alert('Sai định dạng json')
        }
    }

    const formatHours = (h) => {
        return moment().startOf('day').add(h.replace(' Hours', ''), 'hours').format('HH:mm:ss');
    }
    console.log(accounts)

    return (
        <div className="App">
            <textarea style={{height: 300}} onChange={(event) => {
                setInput(event.target.value)
            }}/>
            <button onClick={check}>
                <p>lấy thông tin</p>
            </button>
            <div>
                {
                    accounts.map(i => {
                        return (
                            <div style={{

                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                marginBottom: 18,
                            }}>
                                <p>{i.uid} - {i.used}: <span
                                    style={{color: i.used < 200 ? 'black' : 'red'}}>{i.used < 200 ? 'OK' : 'TÈO'}</span>
                                </p>
                                <p>{i.apikey}</p>
                                <p>Reset sau: {formatHours(i.nextReset)}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default App;
