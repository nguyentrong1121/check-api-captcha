import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import bu from "crypto-js";

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
export default function Camel() {
    const [sleep, setSleep] = useState(5000);
    const [history, setHistory] = useState([])

    let counter = 0;  // Biến đếm để tạo chuỗi tuần tự

    // Hàm tạo chuỗi tuần tự với hai ký tự đầu là 'D4'
    function generateSequentialString() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Chữ cái A-Z
        const numbers = '0123456789'; // Các số từ 0-9

        let result = 'D4';  // Bắt đầu chuỗi với 'D4'

        // Tạo chuỗi theo định dạng: chữ cái - số - chữ cái - số - chữ cái - số - chữ cái - số
        for (let i = 0; i < 3; i++) {
            const charIndex = Math.floor(counter / Math.pow(26, i)) % characters.length; // Tính chỉ mục chữ cái dựa trên counter
            const numIndex = Math.floor(counter / Math.pow(10, i)) % numbers.length; // Tính chỉ mục số dựa trên counter
            result += characters.charAt(charIndex);  // Thêm chữ cái vào chuỗi
            result += numbers.charAt(numIndex);  // Thêm số vào chuỗi
        }

        counter++;  // Tăng biến đếm cho lần tiếp theo

        return result;
    }

    // Hàm gọi API và kiểm tra chuỗi
    const fetchData = async () => {
        let currentSleep = sleep
        let check = true
        while (check) {  // Lặp vô hạn cho đến khi tìm thấy giá trị thỏa mãn
            const sequentialString = generateSequentialString();  // Lấy chuỗi tuần tự

            try {
                await fetch(`http://do.121app.com.vn/qr/${sequentialString}`, {
                    method: "GET"
                })
            }catch (e) {

            } finally {
                const response = await fetch(`https://khaosat1913.com/info/${sequentialString}`, {
                    method: "GET",
                    headers: {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    },
                });

                if (response.ok) {
                    const result = await response.text();  // Hoặc response.json() nếu server trả về JSON
                    // Kiểm tra nếu chuỗi kết quả chứa "Bạn đã mua gói này ở cửa hàng nào?"
                    if (result.includes("Bạn đã mua gói này ở cửa hàng nào?")) {
                        // Gửi yêu cầu POST tới API với axios
                        axios.post(db, {
                            code: sequentialString,
                            status: 'Mới',
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => {
                                console.log('Dữ liệu đã được gửi:', response.data);
                                setHistory(prevState => [...prevState, sequentialString]);
                            })
                            .catch(error => {
                                console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
                            });


                    }
                }
            }
            let stop = false
            debugger;  // Dừng chương trình để kiểm tra kết quả
            if (stop) {
                return
            }
            await wait(currentSleep);
        }

    };

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <form className="App">
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
            <SubmitBtn onClick={fetchData}>Start Cheat</SubmitBtn>
            <p>Lịch sử: {history?.length}</p>
            Version:1.0
        </form>
    );
}
