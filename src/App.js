import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import axios from "axios";
import moment from "moment";
import * as xlsx from "xlsx";
import {CopyToClipboard} from "react-copy-to-clipboard/src";

function App() {
    const [input, setInput] = useState([])
    const [accounts, setAccouts] = useState([]);
    const check = async () => {
        try {
            if (input?.length > 0) {
                let lstAcc = await Promise.all(input.map(async i => {
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

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setInput(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    return (
        <div className="App">
            <label htmlFor="upload">Upload File</label>
            <input
                type="file"
                name="upload"
                id="upload"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={readUploadFile}
            />
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
                                <CopyToClipboard text={i.uid}>
                                    <p>{i.uid}-{200 - i.used}: <span
                                        style={{color: i.used < 200 ? 'black' : 'red'}}>{i.used < 200 ? 'OK' : 'TÈO'}</span>
                                    </p>
                                </CopyToClipboard>
                                <CopyToClipboard text={i.apikey}>
                                    <p>{i.apikey}</p>
                                </CopyToClipboard>
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
