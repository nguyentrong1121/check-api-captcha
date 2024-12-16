import bu from "crypto-js";

export const generatePhoneModel = () => {
    // Danh sách các model điện thoại và hãng sản xuất, bao gồm systemName
    const phoneModels = [
        { model: 'iPhone 15', manufacturer: 'Apple', systemName: 'iOS' },
        { model: 'Samsung Galaxy S23', manufacturer: 'Samsung', systemName: 'Android' },
        { model: 'Google Pixel 8', manufacturer: 'Google', systemName: 'Android' },
        { model: 'OnePlus 11', manufacturer: 'OnePlus', systemName: 'Android' },
        { model: 'Xiaomi Mi 13', manufacturer: 'Xiaomi', systemName: 'Android' },
        { model: 'Sony Xperia 1 V', manufacturer: 'Sony', systemName: 'Android' },
        { model: 'Oppo Find X6 Pro', manufacturer: 'Oppo', systemName: 'Android' },
        { model: 'Realme GT 2 Pro', manufacturer: 'Realme', systemName: 'Android' },
        { model: 'Asus ROG Phone 7', manufacturer: 'Asus', systemName: 'Android' },
        { model: 'Motorola Edge+ 2024', manufacturer: 'Motorola', systemName: 'Android' },
        // Thêm 8 model mới
        { model: 'iPhone 14', manufacturer: 'Apple', systemName: 'iOS' },
        { model: 'Samsung Galaxy Z Flip 5', manufacturer: 'Samsung', systemName: 'Android' },
        { model: 'Google Pixel 7 Pro', manufacturer: 'Google', systemName: 'Android' },
        { model: 'Xiaomi Redmi Note 12', manufacturer: 'Xiaomi', systemName: 'Android' },
        { model: 'OnePlus 10 Pro', manufacturer: 'OnePlus', systemName: 'Android' },
        { model: 'Oppo Reno 10 Pro', manufacturer: 'Oppo', systemName: 'Android' },
        { model: 'Realme 11 Pro+', manufacturer: 'Realme', systemName: 'Android' },
        { model: 'Asus Zenfone 9', manufacturer: 'Asus', systemName: 'Android' }
    ];

    // Chọn ngẫu nhiên một model từ danh sách
    const randomIndex = Math.floor(Math.random() * phoneModels.length);
    return phoneModels[randomIndex];
};

export const generateVietnameseName = () => {
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hồ", "Vũ", "Bùi", "Đặng", "Dương", "Lý", "Mai", "Ngô", "Lâm", "Đoàn", "Trương", "Phan", "Tô", "Hà", "Cao", "Võ"];
    const middleNames = ["Thị", "Văn", "Minh", "Tuấn", "Quốc", "Hồng", "Thanh", "Bảo", "Tùng", "Quang", "Mạnh", "Lê", "Bình", "Kim", "Phúc", "Vân", "Công", "Lan", "Kiều", "Sơn"];
    const lastNames = ["Anh", "Bảo", "Cường", "Duy", "Hoàng", "Hùng", "Khoa", "Linh", "Mỹ", "Nam", "Phúc", "Quang", "Sang", "Thiện", "Thành", "Tú", "Vân", "Việt", "Xuân", "Yến"];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomMiddleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return randomFirstName + " " + randomMiddleName + " " + randomLastName;
};

export const generateRandomPhoneNumber = () => {
    const phoneNumber = [];
    for (let i = 0; i < 9; i++) {
        phoneNumber.push(Math.floor(Math.random() * 10));
    }
    return phoneNumber.join('');
};

export const generateRandomEmail = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let email = '';
    for (let i = 0; i < 10; i++) {
        email += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'mail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    email += '@' + domain;
    return email;
};

export const generateRandomReg = () => ({
    phoneNumber: generateRandomPhoneNumber(),
    email: generateRandomEmail()
});

export const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
}).toUpperCase();

export const generateDeviceToken = (length = 24) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Tất cả các ký tự có thể dùng
    let token = '';

    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const decryptData = (data) => {
    const p = bu.enc.Hex.parse(bu.SHA256('sl236cl929ki829is0c44928q12ce9ue6').toString())
        , M = bu.enc.Base64.parse(data)
        , o = bu.lib.WordArray.create(M.words.slice(0, 4))
        , t = bu.lib.WordArray.create(M.words.slice(4))
        , z = bu.AES.decrypt({
        ciphertext: t
    }, p, {
        iv: o,
        mode: bu.mode.CBC,
        padding: bu.pad.Pkcs7
    }).toString(bu.enc.Utf8);
    return JSON.parse(z)
}

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
