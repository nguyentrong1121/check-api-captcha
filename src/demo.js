function(e, b) {
    if (null == e)
        throw new Error("Illegal argument " + e);
    var p = Ia.wordsToBytes(Va(e, b));
    return b && b.asBytes ? p : b && b.asString ? Ha.bytesToString(p) : Ia.bytesToHex(p)
}

let Pa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let Ia = {
    rotl: function(e, b) {
        return e << b | e >>> 32 - b
    },
    rotr: function(e, b) {
        return e << 32 - b | e >>> b
    },
    endian: function(e) {
        if (e.constructor == Number)
            return 16711935 & Fa.rotl(e, 8) | 4278255360 & Fa.rotl(e, 24);
        for (var b = 0; b < e.length; b++)
            e[b] = Fa.endian(e[b]);
        return e
    },
    randomBytes: function(e) {
        for (var b = []; e > 0; e--)
            b.push(Math.floor(256 * Math.random()));
        return b
    },
    bytesToWords: function(e) {
        for (var b = [], p = 0, M = 0; p < e.length; p++,
            M += 8)
            b[M >>> 5] |= e[p] << 24 - M % 32;
        return b
    },
    wordsToBytes: function(e) {
        for (var b = [], p = 0; p < 32 * e.length; p += 8)
            b.push(e[p >>> 5] >>> 24 - p % 32 & 255);
        return b
    },
    bytesToHex: function(e) {
        for (var b = [], p = 0; p < e.length; p++)
            b.push((e[p] >>> 4).toString(16)),
                b.push((15 & e[p]).toString(16));
        return b.join("")
    },
    hexToBytes: function(e) {
        for (var b = [], p = 0; p < e.length; p += 2)
            b.push(parseInt(e.substr(p, 2), 16));
        return b
    },
    bytesToBase64: function(e) {
        for (var b = [], p = 0; p < e.length; p += 3)
            for (var M = e[p] << 16 | e[p + 1] << 8 | e[p + 2], o = 0; o < 4; o++)
                8 * p + 6 * o <= 8 * e.length ? b.push(Pa.charAt(M >>> 6 * (3 - o) & 63)) : b.push("=");
        return b.join("")
    },
    base64ToBytes: function(e) {
        e = e.replace(/[^A-Z0-9+\/]/gi, "");
        for (var b = [], p = 0, M = 0; p < e.length; M = ++p % 4)
            0 != M && b.push((Pa.indexOf(e.charAt(p - 1)) & Math.pow(2, -2 * M + 8) - 1) << 2 * M | Pa.indexOf(e.charAt(p)) >>> 6 - 2 * M);
        return b
    }
}

//stringToBytes
let stringToBytes = function(e) {
    e = unescape(encodeURIComponent(e))
    for (var b = [], p = 0; p < e.length; p++)
        b.push(255 & e.charCodeAt(p));
    return b
}


for (var p = Ia.bytesToWords(e), M = 8 * e.length, o = 1732584193, t = -271733879, z = -1732584194, c = 271733878, n = 0; n < p.length; n++)
    p[n] = 16711935 & (p[n] << 8 | p[n] >>> 24) | 4278255360 & (p[n] << 24 | p[n] >>> 8);
p[M >>> 5] |= 128 << M % 32,
    p[14 + (M + 64 >>> 9 << 4)] = M;
var O = Va._ff
    , a = Va._gg
    , r = Va._hh
    , i = Va._ii;
for (n = 0; n < p.length; n += 16) {
    var A = o
        , s = t
        , l = z
        , d = c;
    o = O(o, t, z, c, p[n + 0], 7, -680876936),
        c = O(c, o, t, z, p[n + 1], 12, -389564586),
        z = O(z, c, o, t, p[n + 2], 17, 606105819),
        t = O(t, z, c, o, p[n + 3], 22, -1044525330),
        o = O(o, t, z, c, p[n + 4], 7, -176418897),
        c = O(c, o, t, z, p[n + 5], 12, 1200080426),
        z = O(z, c, o, t, p[n + 6], 17, -1473231341),
        t = O(t, z, c, o, p[n + 7], 22, -45705983),
        o = O(o, t, z, c, p[n + 8], 7, 1770035416),
        c = O(c, o, t, z, p[n + 9], 12, -1958414417),
        z = O(z, c, o, t, p[n + 10], 17, -42063),
        t = O(t, z, c, o, p[n + 11], 22, -1990404162),
        o = O(o, t, z, c, p[n + 12], 7, 1804603682),
        c = O(c, o, t, z, p[n + 13], 12, -40341101),
        z = O(z, c, o, t, p[n + 14], 17, -1502002290),
        o = a(o, t = O(t, z, c, o, p[n + 15], 22, 1236535329), z, c, p[n + 1], 5, -165796510),
        c = a(c, o, t, z, p[n + 6], 9, -1069501632),
        z = a(z, c, o, t, p[n + 11], 14, 643717713),
        t = a(t, z, c, o, p[n + 0], 20, -373897302),
        o = a(o, t, z, c, p[n + 5], 5, -701558691),
        c = a(c, o, t, z, p[n + 10], 9, 38016083),
        z = a(z, c, o, t, p[n + 15], 14, -660478335),
        t = a(t, z, c, o, p[n + 4], 20, -405537848),
        o = a(o, t, z, c, p[n + 9], 5, 568446438),
        c = a(c, o, t, z, p[n + 14], 9, -1019803690),
        z = a(z, c, o, t, p[n + 3], 14, -187363961),
        t = a(t, z, c, o, p[n + 8], 20, 1163531501),
        o = a(o, t, z, c, p[n + 13], 5, -1444681467),
        c = a(c, o, t, z, p[n + 2], 9, -51403784),
        z = a(z, c, o, t, p[n + 7], 14, 1735328473),
        o = r(o, t = a(t, z, c, o, p[n + 12], 20, -1926607734), z, c, p[n + 5], 4, -378558),
        c = r(c, o, t, z, p[n + 8], 11, -2022574463),
        z = r(z, c, o, t, p[n + 11], 16, 1839030562),
        t = r(t, z, c, o, p[n + 14], 23, -35309556),
        o = r(o, t, z, c, p[n + 1], 4, -1530992060),
        c = r(c, o, t, z, p[n + 4], 11, 1272893353),
        z = r(z, c, o, t, p[n + 7], 16, -155497632),
        t = r(t, z, c, o, p[n + 10], 23, -1094730640),
        o = r(o, t, z, c, p[n + 13], 4, 681279174),
        c = r(c, o, t, z, p[n + 0], 11, -358537222),
        z = r(z, c, o, t, p[n + 3], 16, -722521979),
        t = r(t, z, c, o, p[n + 6], 23, 76029189),
        o = r(o, t, z, c, p[n + 9], 4, -640364487),
        c = r(c, o, t, z, p[n + 12], 11, -421815835),
        z = r(z, c, o, t, p[n + 15], 16, 530742520),
        o = i(o, t = r(t, z, c, o, p[n + 2], 23, -995338651), z, c, p[n + 0], 6, -198630844),
        c = i(c, o, t, z, p[n + 7], 10, 1126891415),
        z = i(z, c, o, t, p[n + 14], 15, -1416354905),
        t = i(t, z, c, o, p[n + 5], 21, -57434055),
        o = i(o, t, z, c, p[n + 12], 6, 1700485571),
        c = i(c, o, t, z, p[n + 3], 10, -1894986606),
        z = i(z, c, o, t, p[n + 10], 15, -1051523),
        t = i(t, z, c, o, p[n + 1], 21, -2054922799),
        o = i(o, t, z, c, p[n + 8], 6, 1873313359),
        c = i(c, o, t, z, p[n + 15], 10, -30611744),
        z = i(z, c, o, t, p[n + 6], 15, -1560198380),
        t = i(t, z, c, o, p[n + 13], 21, 1309151649),
        o = i(o, t, z, c, p[n + 4], 6, -145523070),
        c = i(c, o, t, z, p[n + 11], 10, -1120210379),
        z = i(z, c, o, t, p[n + 2], 15, 718787259),
        t = i(t, z, c, o, p[n + 9], 21, -343485551),
        o = o + A >>> 0,
        t = t + s >>> 0,
        z = z + l >>> 0,
        c = c + d >>> 0
}
return Ia.endian([o, t, z, c])


fetch("https://api.bomofy-ai.com/api/login", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "st-lang": "vi",
        "st-ttgn": "d29dd743975fe49080cdcb1c01f18fac"
    },
    "body": JSON.stringify({
        "a": "nguyentrong1121@gmail.com",
        "p": "940289dda3df035b9edb74a11e012aff",
        "c": ""
    }),
    "method": "POST",
});
