import './App.css';
import {useState} from "react";
import axios from "axios";
import moment from "moment";
import * as xlsx from "xlsx";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import CheatPrimal from "./CheatPrimal";
import TonPlace from "./TonPlace";
import CheatBomofy from "./CheatBomofy";
import Camel from "./Camel";
import CheatTaker from "./CheatTaker";
import CheatBytebeat from "./CheatBytebeat";

function App() {
    const [input, setInput] = useState([])
    const [accounts, setAccouts] = useState([]);
    const [tab, setTab] = useState(0);
    // const [gaga, setGaga] = useState([]);
    // const [params, setParams] = useState({
    //     data: '{   "FixedAmountRequest": {     "recipient": "0x60c163504c5ba7fc8e462bd68612b7035aae5682"   } }',
    //     cookie: '_ga=GA1.1.693361611.1671609123; _ga_0GW4F97GFL=GS1.1.1671609123.1.0.1671609127.56.0.0; _cfuvid=kAuKvSfh_g0sOuKbd5MbMOvfAkwsTLf0tj7iEv9DiZw-1672028267113-0-604800000'
    // });
    const check = async () => {
        try {
            if (input?.length > 0) {
                let lstAcc = await Promise.all(input.map(async i => {
                    let headers = {
                        apikey: i.apikey,
                        uid: i.uid
                    }
                    const response = await axios.get('https://free.nocaptchaai.com/balance', {
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
    // const checkGaga = async () => {
    //     try {
    //         if (input?.length > 0) {
    //             let lstGaga = await Promise.all(input.map(async i => {
    //                 let headers = {
    //                     Authorization: 'Bearer ' + i['GAGA-TOKEN']
    //                 }
    //                 const response = await axios.post('https://api.gaganode.com/api/node/query', {}, {
    //                     headers
    //                 });
    //                 return {
    //                     nodes: response.data.nodes,
    //                     ...i
    //                 }
    //             }))
    //             setGaga(lstGaga)
    //             console.log(lstGaga)
    //         } else {
    //             alert('Danh sách ít quá')
    //         }
    //     } catch (e) {
    //         alert('Sai định dạng json')
    //     }
    // }

    const formatHours = (h) => {
        return moment().startOf('day').add(h.replace(' Hours', ''), 'hours').format('HH:mm:ss');
    }

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, {type: "array"});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setInput(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    // const getGas = async () => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Cookie", "_ga=GA1.1.693361611.1671609123; _ga_0GW4F97GFL=GS1.1.1671609123.1.0.1671609127.56.0.0; _cfuvid=kAuKvSfh_g0sOuKbd5MbMOvfAkwsTLf0tj7iEv9DiZw-1672028267113-0-604800000; __cf_bm=Dokt2zQ0r0fy9iM.paojfs1mLRrZ_4D6cJUon8FlEMA-1672239293-0-ARcIMjN9oBVzu2aba/gltrIjxqzMzQ5lVWnm98GhKObXO63YS9d9CZxKBzjBfDIvrhJ7Q9PdCPGIe5t+swEP8lg=; _cfuvid=9cUvmVAkRPbXPDeFXRI9hlnCXgYmj933RH4Z1fQBtm4-1672239293897-0-604800000");
    //     myHeaders.append("Content-Type", "application/json");
    //
    //     var raw = JSON.stringify({
    //         "FixedAmountRequest": {
    //             "recipient": "0x60c163504c5ba7fc8e462bd68612b7035aae5682"
    //         }
    //     });
    //
    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };
    //
    //     fetch("https://faucet.devnet.sui.io/gas", requestOptions)
    //         .then(response => response.text())
    //         .then(result => alert('ok' + result.toString()))
    //         .catch(error => alert('error' + error.toString()));
    // }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button onClick={() => setTab(0)} style={{margin: 10}}><p>check</p></button>
                <button onClick={() => setTab(1)} style={{margin: 10}}><p>lucky</p></button>
                <button onClick={() => setTab(2)} style={{margin: 10}}><p>taker</p></button>
                <button onClick={() => setTab(3)} style={{margin: 10}}><p>byteBeat</p></button>
            </div>
            {
                tab === 0 && <div className="App">
                    <label htmlFor="upload">Upload File</label>
                    <input
                        type="file"
                        name="upload"
                        id="upload"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={readUploadFile}
                    />
                    <CopyToClipboard text={JSON.stringify(input)}>
                        <button>
                            <p>copy object</p>
                        </button>
                    </CopyToClipboard>
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
                                        <p>Reset sau: {i.nextReset}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            {
                tab === 1 && <CheatPrimal/>
            }
            {
                tab === 2 && <CheatTaker/>
            }
            {
                tab === 3 && <CheatBytebeat/>
            }
            {/*<div className="App">*/}
            {/*    <button onClick={checkGaga}>*/}
            {/*        <p>lấy thông tin</p>*/}
            {/*    </button>*/}
            {/*    <div>*/}
            {/*        {*/}
            {/*            gaga.map(i => {*/}
            {/*                console.log(i)*/}
            {/*                return !!i?.nodes && i.nodes.map(i => {*/}
            {/*                    return (*/}
            {/*                        <div style={{*/}

            {/*                            display: 'flex',*/}
            {/*                            flexDirection: 'column',*/}
            {/*                            alignItems: 'flex-start',*/}
            {/*                            marginBottom: 18,*/}
            {/*                        }}>*/}
            {/*                            <CopyToClipboard text={i.uid}>*/}
            {/*                                <p>{i.os}-{i.region_code}: {i.credit}*/}
            {/*                                </p>*/}
            {/*                            </CopyToClipboard>*/}
            {/*                        </div>*/}
            {/*                    )*/}
            {/*                })*/}
            {/*            })*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            {/*<div className="App">*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="data"*/}
            {/*        value={params.data}*/}
            {/*        placeholder={'data'}*/}
            {/*        onChange={(event) => {*/}
            {/*            setParams(prevState => ({*/}
            {/*                ...prevState,*/}
            {/*                data: event.target.value*/}
            {/*            }))*/}
            {/*        }*/}
            {/*        }*/}
            {/*    />*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="Cookie"*/}
            {/*        value={params.cookie}*/}
            {/*        placeholder={'cookie'}*/}
            {/*        onChange={(event) => {*/}
            {/*            setParams(prevState => ({*/}
            {/*                ...prevState,*/}
            {/*                cookie: event.target.value*/}
            {/*            }))*/}
            {/*        }*/}
            {/*        }*/}
            {/*    />*/}
            {/*    <button onClick={getGas}>*/}
            {/*        <p>lấy gas</p>*/}
            {/*    </button>*/}
            {/*    <div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default App;
