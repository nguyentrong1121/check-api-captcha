import './App.css';
import {useState} from "react";
import CheatPrimal from "./Normal/CheatPrimal";
import CheatBomofy from "./Quantify/CheatBomofy";
import Camel from "./Normal/Camel";
import CheatTaker from "./Normal/CheatTaker";
import CheatBytebeat from "./Quantify/CheatBytebeat";
import CheatBunny from "./Normal/CheatBunny";
import CheatSoSo from "./Normal/CheatSoSo";
import SunBit from "./Quantify/SunBit";
import CheatTriller from "./Quantify/CheatTriller";
import CheatICheck from "./Normal/CheatICheck";

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
        },
        {
            id: 8,
            name: 'Cheat Sunbit',
            component: () => <SunBit/>
        },
        {
            id: 9,
            name: 'Cheat Triller',
            component: () => <CheatTriller/>
        },
        {
            id: 10,
            name: 'Cheat ICheck',
            component: () => <CheatICheck/>
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
