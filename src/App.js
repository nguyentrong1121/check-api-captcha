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
import CheatBunny from "./CheatBunny";
import CheatSoSo from "./CheatSoSo";

function App() {
    const [tab, setTab] = useState(0);

    //tạo hàm để chuyển từ mảng thành select option và hiển thị theo Component
    const [lstTab] = useState([
        {
            id: 0,
            name: 'Cheat Primal',
            component: () => <CheatPrimal/>
        },
        {
            id: 2,
            name: 'Cheat Bomofy',
            component: () => <CheatBomofy/>
        },
        {
            id: 3,
            name: 'Camel',
            component: () => <Camel/>
        },
        {
            id: 4,
            name: 'Cheat Taker',
            component: () => <CheatTaker/>
        },
        {
            id: 5,
            name: 'Cheat Bytebeat',
            component: () => <CheatBytebeat/>
        },
        {
            id: 6,
            name: 'Cheat Bunny',
            component: () => <CheatBunny/>
        },
        {
            id: 7,
            name: 'Cheat SoSo',
            component: () => <CheatSoSo/>
        }
    ])

    const renderTab = () => {
        return lstTab.find(i => i.id === tab)?.component()
    }

    const renderSelect = () => {
        return (
            <select onChange={(e) => {
                setTab(parseInt(e.target.value))
            }}>
                {
                    lstTab.map(i => {
                        return <option key={i.id} value={i.id}>{i.name}</option>
                    })
                }
            </select>
        )
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                {renderSelect()}
            </div>
            <div>
                {renderTab()}
            </div>
        </div>
    );
}

export default App;
