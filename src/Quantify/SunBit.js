import React, {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import {decryptData, generateRandomReg} from "../utils";

var bu = require("crypto-js");


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
export default function SunBit() {
    const [email, setEmail] = useState({mailbox: '', token: ''});
    const [sleep, setSleep] = useState(5000);
    const [authToken, setAuthToken] = useState(null);
    const [refCode, setReftCode] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [history, setHistory] = useState([])

    axios.defaults.headers = {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*"
    }

    const reset = () => {
        setEmail({mailbox: '', token: ''})
        setAuthToken(null)
    };

    const fetchCheckin = () => {
        setLoading(true)
        axios.get('https://api.bomofy-ai.com/api/quan/start?rts=' + new Date().getTime(), {
            headers: {
                token: 'Bearer ' + authToken
            }
        }).then(response => {
            setHistory(prevState => [...prevState, {
                mailbox: email.mailbox,
                password: 'Nguyentrong1',
                checkin: 1,
                status: 1,
            }])
            axios.post(db, {
                mailbox: email.mailbox,
                password: 'Nguyentrong1',
                checkin: 1,
            }, {headers: {'Content-Type': 'application/json'}})
            reset()
        }).catch(error => {
            reset()
        })
    }

    const fetchLogin = async () => {
        setLoading(true)
        axios.post('https://api.sunbit.cc/api/login',
            {
                "a": email.phoneNumber,
                "p": "940289dda3df035b9edb74a11e012aff",
                "c": ""
            }).then(response => {
            const decrypt = decryptData(response.data)
            setAuthToken(decrypt.data.t)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            reset()
        })
    }


    const fetchCreateUser = async (isLogin = true) => {
        setLoading(true)
        await axios.post('https://www.sunbit.cc/cdn-cgi/challenge-platform/h/b/jsd/r/8f41746598e7dd49', {
            "wp": "TDoYNtxFNkoNE4uxSx-nZYtqnaKn070ggtFxp3nJBqPBeon$JIAuBkxQnESo+CDDnaVgncngqgoxndgxruvYVkD6XfYJBmDKa9Q-4+HYrmN2Kynx$JuO0nnWnAgt7nx0$n2noe6T6enNjnMpJnNpCdn4GcNaFdnVmSJnxGhnxab4KQd-FnwgxeHoFnc5CktVIjXNYbdBgnyNgnEg8$a-ZRF7GREjxvgW$nJh90XPLOxjx5m7RHH9FISp7Og6Rilok2UXCaKPL$PnnrGenbxnnP3JDJw-qYKNYPA1gI+ra3MpCPhonKFEGdYka6NbjUrAqLFp7t7MC-FMPCWBbn+Jv8nnuq+ujcng-3WN4Jn4YqfYkl1d+rLS0SAcM6uxqqaEBrBprAQr8SMnNJOcw-4e0Z$$08nbqJLkg91GMJFzeGxzSfyDyoYnxCj6bDj5g75n+E8FDPaTRT$I$V6Ybtryq99SwWAgncoRiNt8EYAnN6Zjg10gQ+tqao7JDnJIk3D16GZjDJnJduggBN85e+atFgNK8trdNMwtHd98Ky-08neqJOnIJLSo3txNOq$OSpb2ogaNBV3pSqW1oTpeO4Xn6XuVrdm+pS$j2b+39i3WSTDSCdTp519Xu8+AROySFti+GZDkehRJA92maeniJnQyxKEgjpa1SNvBazR3zPo6NjO6fgRbwxWyNrynBbZk$MeE9KJknuJUZxCoSiZDCSCng0gyxA4Y0jXtSHjJxg3x6KUGU7bA3tiQAZgB+nea3uI0nBZLRxjNUngpTavgeZYaxDnqCHq8n0t8cFbNA1U9aDemQNtAYnxaZjBamDg7FgoY$cUor8+n8$abja$66q4yjoID1CeO6tuhUe$YNoqt8+Adru1d6x8nayaD4wT$otqwJS3qYr3ZaTnouJ$+J3qFxkkdTNQcUD1WgnkQYtx6CoCESeUFne0B6moNoCwxJIo$FaYgko4a4xDboTxjugmrgmg2H5QOpHJN2qxxNLTkDTU5ku1gcaxgY4Nv4Ix+CcUT+woqp$0xm54UxTCwknEanNdJ8xbwpatI+AGa84JtxLwU3nInnpY2IBxKmjVKNLannozKnYNBFuLnEAcG8pn8mDmdGFQxj+LtxwHvlBhFjpEo4JSmx8B7pVhObtA1eFtSeqd$n4ZwJCTtcoIMtD42kxKHY+8ugJ4qLMD58o+vGJ8kO8nBnBqjBbgtx0mDjPm2eFtIE8-VV4IDm7tgD-CxvoxIpkftqWgqxDexTt0-VU8ccM+A0l-S1c8Fqn1dZ$6So4ouobZDXi4U7BAb9xnjbafKa0g+KlhYO70hHJV0qeiM8hqyg8Ag-C4HDfVt+nDgjngdQia1G1pf9G96r-OpjoHn1eGwFHXGTUdepe7fctOhag0BMfWlDS4oZKHzd25fNC4oOU$+nj8IfDU8IexfBNmDDm2EawGiT-NprGgUfF5TtttyUqSb4+y1OFoA$ItL4xSDEeU9c5Fx--3gwZ7XG995jWlxPAwM83BwUh3+Ei1MHfYbugJEobgCE-i9XXQuglPWgnBYYdv2L6Y1WoadyY0Z+19YREY+Yen9+LoItWUGbomqvXDnY$N1DNhbYBAgEYOb5+2Y2cdQJ1LiPJCGcdbxKNKJ39YBgSmvOV0NzReWwTmjB1Q6PfkvgPHx7u2ecSUg3Rrqo4XEED$i+BVUaQMjXNXHN4UWmdjQ2LVNthKgh8wm2W8NoMAamMYve2tyYToqoFULjZud2en2NKY9gtaE2gdxKNqJA5EbLFnBNqA0CuAgTpEqrZUk+MdUU5xIaC0Y5mZ2Lg7ngownuumBzxraJIcjpVpw2nW4Aw7G8INJnE2JqjQJWY0TJnA6mZgaV4ZBhDhk1qaL4TtA5mnMCVt6o1N24jw8PojtIXB3eJTL$w3bTAUjk962yoE2A7jT1ry1cW08N$mUBjInAagRYW-Ly7pgH$drVUxOB5dXAZd8xmje-wKgcMVFm4ixcTUzSnBPNhgIxg+6YF$NSa7za0DRxfDdNZJYouwu8zNatnJckx2bRWmJCuBKavKYdQE3BzYbIN$erDFy+MTCJ5eP2Xg0YIbcrzMPrE+SwmFRepSm7E2Sm0AjrtJF+YpE8nf-OQJDYAgkxWMJuo0cx2ixjOnteb05KEqutgnqG0FxSyumF57L0jWn-toAT1aUk$2RfP20b2WDWk4Wj51WXbQZFNtC5Ej+YbnJHWS4M+523jlahte$bip0xgD9P2me5p-FY7E4Dc+3a-WjKic-jaOerNgSzc91LJ0qFBxm1UngvbmAzWuA2wPwBWnjS+mkJH08NJ3AqWTXen9ckYjxQ+jb$0XjoEwON0etYPuBjh+NfMWkIzZ2kJz6S8dckRAGW9gebTlkdNhcRdo05rW1M5pDnywp59zZd7Nwri5BEhJe1o1t762kMMIN912d8IzRJAJgfbYYdz1po4G62NGT8n45qv8ehdPt-219P6JMGo2bbL325i$D4xVBamlFX3vGgNonkgFLPvJRvAqYGXdi5Ca4NpxonK8obWDrTpgURauraOSoEgxxZNtYmBjHUSKqL+L$NDHGu9cDIWqncPjvLOVZGC51O20YF9d$moZOzFaWTyHvx1XZhYnnh2aCelxyAb4v+ZoW7A$2xQc+UbmHbJn-qXAKBLWxOTPJaGe78kn2ppj2f7qnrr4Zn6$Bww2TRA$AEnpaq82Waw19c+UHLf+2p1jvJgQ13QFMgjuGRwnTLbh7-IF4r8IC0tWkgc4jZd5cJaAQFLKZ5Al4VmtpSQ-9aQ5WhtuJe9BvyAjxDaYwbFg0n0mFgNoNN4b6vOWIHdVCmdPUfESpDbcajSTdt9wTBRR+c9kWv50VfhWCczjypBHeaRA1HvfWKH7+y9GkHKK81drlzgGBLWr8qrjSmk0y6rvmPeoqEh1md5wPXERkQm285mtd3hh2gvzZ7Mh1LzdBvjYchQhfFh5TlZl4zn$+HQJZ5wzUfmTT1WLLXRyhcQExYnR3RYBqg$bVXN1NqE85CrZtgexGP7OD+oGeec$N$lEpjAKXhNJENUWpDgkkxuonn4kNejKr8YyQOTPquvGHQyrnUFldfbi+U+SphB6NaxmARU-hpVx2n7F6yP0DoPZdmT4mx0hO6JxMpceNCnvcTzgnwaRWmjZJvWBrT$tziP1cPSviZttqIL71-6I+aHERRhtE7ARMmbUremIQK2YzYeIULw5l3BQNR4g6ZNu2irFrYM2FCyAeKDPJ-mZcPG2t2FuJ0tSb4yRIJh9Hqnb4JlIOQYpEzNzttBMh6Xnwf09aHvWC5EYaZNeJ2woUDQti6jNe8CmWx0vwi899MXtYh1aXOtedT8HywxYQv2E22DHzIk+-oNfOZWIfPeE4Kj7fLVAXDaQBIV0JUef370Yu7xzIZl8D4PflxTvzD0SlilODNlN4Dc5$lrAZNrbCW296P6W82J3OPYaadXz9nMk$kYaCn0P6k8yzP9eZk$3OLjL9YhDrL$P2MXYGLzLKJtUTYHMKYF56a8Y0CYjTYEM8BJXjgCrXzWC8z2y8azgEM$4+rKnGaWMrYuMzh9rOxaMX9eTobzggvaXYSQnTgA3XSjj1SVAWSOSC4ujdooYocOjM5WczhXSQGClOF$7jjhLeeaXW6$I4oFPW4VE1tXLNhClX6$wNXz2cx$3QnfUgg4dOgJ3zXxpCl$i2qXDgn6i$3YVzhziYTxD5JFxYTbxzj8dQJHj$E0YfKjJd$dm89$3XK9jHKClXKVpz$dmjmzhXKQT8AgRcJdAdmVm$EJL8YgqXgHhYgA3Yg1R$BHUeq$U$3zqrXjeXU0ej3V3$R$3VeQLtXYOKFJOCIuPbz8Y5OXEmb$ETOzHN36nduEwrXObYbWjmbOwXZcu1wW4$3Xw$TXCrFmk2k$36yr++AelWo+y6CFlY2VGVmbFHhrIAY448exG2o8YGIHIkwOv$3629wov92XCfAGTCl2GJ5ra$3r5K5KhCpQ5QJgpW8hY8pWBmhO$FPY9CAH8kTYTKFgHClY9VAm058dpoBg0mhOAF0HSrAG0kTV$A7F43$mYdK9982XU17E6OgA36I0GCb1IFGVIF4ntFP8b0tk28YgNVmT5a0CPjWh1+7MFmtdvWbHhrW0LzY0oA7jg1L3nkBMA60MAn96n93JnhDTlOXzkH7QvnNJNxFuHZkER9OeIFlKR6UtRVCARQL5RzMOBMhrLt7XB4v4yuuJy3Aau8FNawLtBoLdHCIJwT$nrKJCuJgJ4xrG-baMMtFZ4cOJvnraoEBoUHxxqaYx56Uennn31p26VT$3-hgJejN2tFtuzHoJnj8Bo9KQxWbDNhgQn7nJn+ebY2n9KF0ub7wdYI4Wjv2otUZpnTxKUvLCO7tHLt-tq7Uqy9UAn7Ndbe-JtfoLLIRx7+gQgemQQF7tzin81rNV2SeRD3DfZImP$pbPLX2hDf$hQBKcQa76Qc$x8PQlQLZCNdYx7pgj84x+NWg$nSxi0tbDxNUfq00uggED4PNlZn$FVM11DYNE5UtynIydK0j7mxyJhE$n-StTqGeB1k+JnJU$xhWuhCWSn7oJkr2J5yzW-wOVr90+eqbg0yxxn0xfN7qxt-WqeaExOV2lE6+U7bxTxO-LDNg1141WU0tORY4hkDxoa212m7g$wftIgvwKxFzuj8NC4m8V18-gDSn7OOUSnntcNBNBVY4U+Fw0DknESKtYG4HJTnnELFknvYVK+InER2JK64JOi4R$o5tnu5NJO48n6tln24f2iBEr$IXJUqtn22OYS$M$D0w2O5lnm54D8YZ41I267Y8YQ4GgZePJCLNJpAo4nBkyubTntM6t9eF5$$t5K4tM2ub5knYpPCUpS28Y2i7n2Ix$2gd$u5FEpOL$+oukd$7cdJl0zd$BgEXBRI-BdJAY-b+o2g5U-kOa4DNcHjSgYLyp8nKpppjp75NBNJVptnAu3dngX5YM2uvuVFkpFnQpPp$JngDUHYyYTn68pgv4kn1y3dZbOghJEYF2g5B0nE3MaTtTmF7nppAYA$j6TYpb3jW6KgPBoW+I1$tY+ohL126$YuB0hUmBSK3CJBdyZqAung0I1Wttye-YMBhJLC2u$0UgCLJ5qcqu2WnEg$$J$91KG4L$t9+INUrkb9Tn2uC0-$2Ua96nAuZgogd9GY5E+$$5Tn$T6gq9+YljZFcyS949FgGjT9p$XJxu-999XJDUFgbg7jZ9RWiuZgX9l9h9FgGDoGTnxuDGQ9TnGT7IknBGz9CGvT7jioJG6nP9ZgGjkyT$pEz7uG6n$2bnrGknWGLGonmGxuwGxGonlTjYqySudtTn2GB0VtTYzujt7CZuF0qBHGTnY93nUgXJypjAEr$$j9mFFEPGjtM9OgJukC29FvAdeCQUW27AXSTYYEtvQUnABkeU29kvrLrvbbpETnpBiBTMLCwUv5inRnovuMXARnKgjYF46nOpW6E2DC3FwAZU6ntM$TBTfvlp9YNgxFenA4QcZttMm2Nt5AF0Xp6nzuA$XIICVYi6$$KTVIiKon0NbNVgqjcu5ATUTnnYSgyY9Ynv37W$+InY-Y6unTWBTY9N6uvYD9hai2on-Nrn09EFf$TNVYyYVtFCL$65lNyYvnTwUYEpRpknDUjF$66nnYnVJV4MBVJKcT9YZjc2eN7V$VkVik8VnV$w78B0CCJMGy+TIN2IuY+8knwVaK8NFryyhpFNT$pV9VTFhO+IvV-V2VT$ZuHIppyn2FdJQVGFNF1FZF8oxajaFE50lacTZucJj1ukWYvFp7-a8N71iJ8NdM818NHuSgJtgrcNHu8oyYIdPIYAoGKTqTPGA$y1DU3qv8kpW60Ny19YMOv8+omYNk6BDkR1yNmCLeO1N1YVBuhwx1E-MC68enY9JuhJTJapzAVUv1y1u-cCk-YV6GkBM-2uMLQTTFmCd-GKqnA$gCN9A-y1vBenXJY-nvQalV5-XomTir--Bpy-6yM-m-gAi1j-y1v9g1w1yY1Cg7MAcAM-iUi-MbWn3-RGYLu-1AIwLCIABAFAtA0AAx6nWZtkZxgEdCI9ZgAvSZd03IFnlIYtbIB11J8YF12xf-qyQ1rM3STnIAeU3n-YPWM5vBoVobeZRZBpzZ2nxa1g2J6CEY2UzZoVwAmAxZbZRUeiLCjCVC-CzCW6nNVtFiBgZjT$d$nNGNTwen3CnN4959ITTnQ1TAnBFF80uq+oG03J4zpA3dGAO99z706n2zZzkd-8CVAT1z5zHBPnXznHZzvn9YnV1zmYOnL$mpQzMO3Sf-1ZJWv8fVngRVVNE1nW+I7HRnWHzVtNGYYdqB0HJgAg8TTYEg$ganOHpH4zpq8n0Hh4k9m64zmCFVVr0HmC1ZBI4HHHgA3HqB8zfHQzPHqH8zlHndl1$RAEmNQnd$KCgA7-dA+Hi7hH0R6AW-jRX-yzSRD5dvenkH$R$dkCcHmC2I7v6CxH$R4ROR$R4zX2awbnjANRRnqBY9-UFrgEI1L96RGYX2MH6-QzX2eumNy-PC1536x9QnculJJY+ISgKqD5fRr2Z09a6TxVonW+hpL+TnS+nv1AmA7C2u68AY2cXJi+uL84gEhGi9lc+$b+v+d+UAxaGNGnqn7Z-+pJQnZHLCm1fj2UYZqnoRM+Jg+b$I4-ppa-dJHYmBTYVtdSZtCy$qmARzgEIAbrPCf-3zZ82N1tCEQ+i9ObAYr6K9W6FpRTdB5CMwmQ2CWBAQCA8oqy1iSgVQ7zZQHQ$OFFd$zQ8o6HZ1mFd+VQlQ6AghfQICVH40IQUhmCugSO3qWn+QfQChZNAhEh8RD5khi9uhgAm-7wMhM+UhSgEY+7xhXQPTXT0hSgSJLTwhVQS+5hmNWnoQyhv$5h8Y5hUHZ85hVQ0h2ufBfhH-Kh8oNUyIFn8op$fFihzJzGVQI-MNtn+upEfBNUiAEh80qADy0haPwMOhuPBhfuhMZhFPhMLPVUUAdPBwShfuWhiPEh4T3TenqP8oNP5TEhCR0mx$0hKNFCNbpPcuHRPPZjRIPPxzTHGhy1DyZjJP68760h1ymnI37nLnan-P2YWnjIUPQvJY0hu3UYQJIR63$PF3J3pZC1gE630h7-BJ0n91Y7532gUA53vY9Yfjy-8nRA-3Q4$hGPpPBjqhyM1yuJ-3qhJuWBZjgXznTC-3ugFg$XrhX3UPBj6YtYtX5P0X1YCEi3BCbn43J3BjAEqnJY7Z-3KXc3iXvYS3+$4X8o5B+tf8hU9W-3OT3+-XpBQn8oHX3jhUhXQn+Y-X2JyE-3lguLBQHjUfmFf86TUX4X7bHWu6vg7CJfFYNCIXBX4XPjGqVF3PTU-3KvMMpX8XXQBjKvavlQendfBCqncfUg-3VXjM0hTgtIY5J30h2IhnHf5YRn0hOfvgyfqnZXMQJ3ky-8E33fd0kAKfLXXQ$pTJ0h$ppzh16A-PtlHB1hhTVQWllhxPWlIPz48PRn7PknWP-UEhWlzP1PYhpPyl2TNQ8oWlL3b3blDOi74nVlr3ulZl9AZ4I+wlhlnBQ71-eG8ALHvli4n4rQUN81CpgxUMH6bY4F-NF4ioh5W33PlLWUKimfanh2tQyN2JxInXVOX7fUnppLZmJnnN57WETvi6ChbOzm7z8wbx1ItX$0pDV$NLx66bYHg3aWBtUWTCxYGYqoR+jZaxHNTODYJ+hAxxXVEgdD$-kOTU$DYR3eooNnSgvUAYZD3jqCn0tKx0YYotjZA+wyyx0mZgfnpjaaNJnw20tarBnR8N9I6nAHCIamE8FPnoNgGQI7F4uU5FRn0ra4ApjYTaJ+tJ0cP7LLWDPx9btzZrSIaStgaHYuo5WA6n6qqxAg8zoUYcEitaYBgWmKNtENItgaENEYxnPd0yxGkfRTUH$37+dqtKw9hGbDe74anIKlC0xVRNFJ5NUKMZuY0nUW+vA7jUS0ohbJ8z5NdKA9Tjhbn3EAnSMxag5VBe3wlOXL-UtEAu3LtJqSnZgpZaDZzjlC8nJdEj0nPLnmCcgEgoYNiqqyHt0g6UyowCqLJTxJbdnuFYIQROtB4n2uErQ3-lE3u6uf-ndrc0nDYnvc+t5n42+kWmx5FugEg+bPdJ5yPK48nYchAyHKqd76nEatL0gno8nUU1b63P1GboV$mN+hnghN2V2YZYuHnjz83Cm1wocudE$w6PkKtTz$wo2DK0eMH9gnkEQ0DZ03Rj$n0mRAcKQJ4w+UVSm2o7D+UbE45gYUoQd$Mpn4+CNax+IuA5TrfWigocu8+PNb3kK7VrnA8wAwaN81mmgEPUX$g7uVNnISm-Af$gY+n0jxTaHR+$HWcT+LVCmZgbBmWoIVutVm+oPM24UG4LVqmLCu+XC4SNU8lJZbg-9IbBty9JSfRteK7Q5ZMmq7pgFSrl0Dt5xy8xQTMNgx5L$OiWzC1UkFq9KU9fmWEzF6rZI0wVIquYGeNueDxUC0qwEP6uINhWon9cfRxU5fqnNo9FYAO0kNgamk3A+aZE2uHYJbtbnPgHIF4O6Pejtgpm$BFExDNzWGVqqF9eUWWZ2jBmgqEDiA1m+q1VUbd-jlChcu$V9IQYlJ5FmcejYQylgb8wYEFZ9JSx4qA8aIfZAH+6gbn7ZMV8nNgEWDkolhMuagVfJETemSN5MnRNiwd5EDO9F6CxubWrpCEcctgNJ40qSAtF5DWtfwg$NzNE0uNTTjc-aJIntMd$GtgMB+ElNWaAJIixKcZHmuMAfNE8d54oQvuYevta8G3+ZJD0WeCNHgEcqE2OCLeeJY9$qcwJonYqdJRgdM3PJJxeon$i8GdpUNj0ievn3qamgD2I0MeQDpBTGmYEPT5WmFZ8d5+A$8VrquNJ1VnSTWa0fgFE4qnnZlka0j6XJY1XqZRaXVLJ6tfxtUMo0TpunnVelbBUDHrnMDJJZMTForjp$yED+Z71y3pqi1znTnH7AHU$eyFBnHiZ$GJYOw6gLYvYEMN14UnA9vDzj3yz5m$-dqxmOyHF0n47$TttO$G5p3zK7$50Bn2Iwitc3b2LOkOpIm71zrF$Pq8OT80c6eggn-VIEPAq718MbQG1ebgK3xTt-+UjxbqfAzgtTc$WmB7b2Ihm41rbrynPnPE$YJaT7xNmbr-tenede72NmFSG0NK29ZB4FNIEgBALXT1c$7ToL2BpyQv+cVWq1O4ZhVQGbixwg1YfPEWAT+9wlm+M4BzD+hm$8$N1OODLK6gJUN4$UD-BjkcNbFoHVvWTnf4tU+0YUgeLR5h8tVoUxj-Mn7ulgf$rm22ouniBXv6aUJwE0QIyuIUJBScK2KU75u8TV1ozku7xaZYYz91uDWJUFxB01r5q5w2NuYjT9cenZT1K6Oyk+uOrwjUCETNmw-VM16+B22C-QaFC6IWbp5QOARYJdeMdgSFEN0yicCKzjHebDt-icDQASEw2TQY41wggYMfG+bUI7HnpupDAUY4Q-uPwaoBtVzZjEJAPwczmyXVU420xvFdWocM6VO8894c3CkrdlgTrbIEyZ8tHKJaJxx7+OkXhn1+ew$L-5EpgHcEjnzyy7X6dFOncJn4rM1Dy1uQaugx8Wc-$w2FXxnZomD2CGw2YcxZQoz$tTXeoWHMmPeyxMBGwMAAcg3cL$t-lUx4M6HYaO$0TUAnCqYZNB0DL7yyRFvh23TKnL-OWHGnMGT0PrygGyzAZTOx1$48yey1uVk9TqhrQ7Jj5g1d1z3Ct3G2yaFOrgZcukdwdw1ulObFaf$NelOFEZiGt$8gL74W1qHdulugmw-dyGGwidnjX$tToyNg66HnWZ42oxwYCaC8exgh2YvdXFzDaAYQ$YxWwkYYMdMbo5bt84l8AIVzoINInD4qI8Mnm$$1dUD68HcuhgCv80gr4W6k2YUO34+mhgj$7t+OtD5Amc4R$ugxg4$2zjld-O08HY49ypnq4f-cmgYNJMjZao3CemMoC5K3J$ngEyGOnzlwLZ$8onuiMYNi2f54nDthm+Iqu5rZELhBHXYEj6O8t3DQpJ1Ov5Vj8AnEkQaYbUU6DPBTaMVJOVV1Tr09FncTejTG+kgYnlrb9ae0ubU25ezjDkbEGPxzJ58un00Qq54pWWKgvo1idUNb7rrppjET$FraX0D-e8J76nJ36oNiEX7XoFFaY3AzRyF52O-02jn25L0DNS2TY0ioYN2jNgCjqBe2OANPLvjr2GU46JaTXwOqSao$ov9ACg1vISqBEJ1QhMMhYBr207zO9G5atcnUYuIenaCW1nFBHEZDXwkF6kRT8v2SlngMmqyKTb$USlEyEDaPL3Z+n3ZuK+C92D9nR2y+Gy1I9L5eYfwVIGy1h-iA3ZW20EaX6IzJzxoXoA83wkUB6NK7fE0b2K0frDYxnyMfGhne89eKlTI51JgOxVc4auq1e3A34FBNgnPTUYTCNrXC2pLuq4IfnkyJaT8$D92ImA+6oqN2k$-FxPj05thNDQCzwAF7OnnCOnNyIUqnWO8czSLjbnESF2kLYWCg2DW4DMA6aYbOdKpo0nXAW51WWRVJnMkoyGYb6PX+kWnqGUEz$rrtVCWuBaUCPK9ZC$w87$DBUyY61-4DW$4RnnpKGBwYiWEdAPaUbLCYjBAnUY$ix6qZqhaK87UVcI2zmoNvqjwOwb5FktkEBBxjbkvMJ-a7xTTyESkqruk4-H-JFpqkKTWz2-hotnYKkrTgAthRR-wAmvo9Fk+fmK53xvQ49GKpz5OzVg-0+NrB8RhvWQ$tnPTGKUXHTqYx3CuGh7hOhNzcpGkRoN3NGNQYqp7L$UZSWhAie4pNdxntczZhaYeojLDB36OJLyzvpZkS1KUmHAJGWc4L69mUOjYvzFpVL$0eB7NNPzdpzLOnciCt+Oyejd$4v0Ot3RqtHpMY1vHrjdy8ecn-LDB4xz2KiIkL$av7ofpSKRW4pXkrxKxjok3xf6XfkeZrCoEExETSgoVEKBZkJHFEnvbSc2uUSDUxqn729AmWIz1WFTH$$oJq9qKwmz$ok9V01cHKOUMpP$juodUDedmCTwN46tgJGDgoeT4ZoFkLxope1qy+kDvG$aAP6geTFb2b4O6L$$k$yRLaSxeOu5BTLq$JHTkOj3ASbBTJr8eHSrULSkEBS8$YoyCzYlEeTCl4Kt0Net-25FyYBBFVBUtBWypXae2Eh5Dx6K+DnBYaeaOCVmWbLXnhmxe+rmMWQAurW0+IP0PTBInR2hmc9oDyS0XYwWeOzi$7prOlKwrnd8yA7SDZ7qm0QxFgnoDBx7qzIEYuG+z4x8reatdWF1N0MBjRcyrJeHwbWAYx7qKJLhQi-aBLCnYZDWHgmMkpOZc9k089XVglVt0etltr8J9OlzLWL9tyxH1l0JyNH99-Uo1CpCtQTkXi7DpOFiMeKhkmoQZ46421ikdk3$$SiRmIV0$Sxh92Sv0JaJf8GHGFaM4HVETaBkOAI-n4vC1+xpMt3Db7KGJDgItLD3u$JJ-Cz$$Vet8equ1YoLKonBCdqLS7vYG6dnObp9k0pzdpObEDZNMFEMNrHYN5RgaG7BA6o-np5no7Jolmdc-OMAAkVjOBZB30-lwTxz7ZVu5u7O4p30LGXl34AF$PYPBaYC6ODcOJ3rapq7+IxhGpxDnACe2-IGnFIcLhWDvGLtia$R4qp1WGGpIoPMvXWxhzqL2qkOdzVmpkyVG6nQOVz4fDbLxjq7aiOZJ5VIUh$SekLOZnNpr1rbh73PgZxUYaHwB$C00OhaVPtkM0Cd71KlJ28KW82kd65heZcS7ZiEW2TWTAn3kOLIvCW0jeexLBkUOEkFuXGR+YQLU0vk20t+gpa8$LovkvG09FazNZ1eE1ABewh9RSrVSt4d7MuHm+pxgVML$NZ8uB2YyZ2kZt7Mu+Zgt7njUuEhif3Xy8GLRYMPGfduJPPOeJv340MNOTqM5Rk5LC0McLC485UJx4iBy2fzoW9RFv$TAyCP6Ry4LovRWXfHGCzPP5wJgd-MTzxony7uT$CmNV7K0YNgdrI0GWknHHAgaPi8jWegHaaELV$NgAnanP0fpTuB0zBMehiB2Vg-bn$$AfGw+ct79$nMc8MJa4DxFnrA-BKkfQel2G09n9RFDATeN+49rNJYgG8eB7QCLknfx2dnfzgnX8JdRbAPhO8QMELQtpOFTZok2SW09O6gtg7i2f4ba7Ki6LeoDtAcN7dbSKpEZjwJTTBOe0K6XAFTU+L+4YoFXgBjFhpLjhq2KSt1ExYENLbvZKvhZK3jgAC-NkWi7dfnOwiNGOZJYo7z8uYcaXNntua9axAcd+lNnt30+dejV-TfBtKVi+dTVnb+xjm8OPMwPaYAaQtziK1mgJvBHU2G1W0r3uh8Jy+PqI7loUKpemnbZWwtt-jBdPKDFLVRm85ZaNUcDNWmpItQ5epEzv+nrGgphFVhpON+ZYnqDYb0XTpBF4jJY5oPKUAVF7TGZ8hi8ntUrC+zW2uvl00SlYqm7Mnt150-Jmx$TXeWnN+nYtY3aUvo0NwEdP1wY3+ebwA3k9zYK1kNLrNq66jIP1HXOJnUg05fFkpeK5Vk4ciC0g-FxRboqPWc5OtdJPhAxnHYgwQ+6VUXJd57B1d4R4VnFq+DPCEYM7YMSExV$Serxok-1gfVvjenvMx8weTIut1bqf6YOt0gAC0VP69Zh3V5YZ5x$1KmPC3N$Dxji1yWFzt1uThxg8D4UMvGlxFr4BEwoINnn36HO7rx12uMhnY+XDbCq1E8x8xFt53Irm1WOKSmWGCxlzfMXeyAUkdVxarPY9Yk$GG0437QN1$JEBPBHRPmknUCcOO5ahWxEVYbYBiUteONyujrjCGtL2Jf1Hf-vWC$Lldz4xzlHUkQpkuleTUxqrfW0wKnkrfxjiuR7jT00FEOV1Lzc2f00uLxCQ2H1$wMBVg7R9y2H141wwpET5bIJOgFOOm2fa7H2pcO0bq751zU+cxCa6-rIoWcSHb3apXeRXH5Ym1BKVrHjwiSFfbTVNYeAJQEIznNA$oAn0cW$enbBE0uzretEWGFpWZO8O8baUyIm3Lbx1pnh$27hj6dfJpXAetlG46+dfazrzfNGNtIRIWOcJQH-8f3q31Olu9xwSNcEjDZOqatwFVZtuw1Adhb6U7vhbP84xF$K5rfE84RSuKEItUhrDGyGDdxdYXoh55c4QKxxHSQpNP$jjPti3A7+qNOm44lJldFUR-G9mtnuWftbDUnq2ewtndOP4WY-NiDRmDm$L8JwHUQN-+xEqeSQY2T0DAIadJEHYRh5qYSgEkxQAA9Abl4j2h9NE-RBbMXYPjuF8Y+uZW94Z74Xy9OHzuYx9ZQ7tY+pY9WbMCjlfxKODKCCf0TZkaO7RCKo8Hgmokac7-CCkPvu0rS2v7pJ4Dx2YVo32-ZTzgFCSxnzW$Ebpyku8ZRiiGNt0v4GC6qh3Zj5i63zQCXRmaa12qbRyk8CCqgJYiW8Va-ngge$KxDSJ$8fimmnQt95IK0fWmurW9BxyRMXPabL6h4aHYAx6uJXY6ounoD2wWz8mcDoLYp$0JUTFUNNMe0$e6EA8fqgOUetm5QWB9FTYugK9$eUUp9wLCRMieyGeJl9wC2luVzpAjHwx5nXmo$1IXdUNWdU+UQrnznnd8b$KTqGpE0eKDZqJi9Mn$p5o85KvHFteWGkhpnaLGkx6QuD1359UuUJjN5zo1YmVK$8FmX5rracgnaUVfV3mKo1jEijoEfMCzhFzV2QWRVF7V50tHrpq01pFUcFuPnqycwOa$K3+$oK9TUw9Tka9fomz0TyJItUmuBuPn0w7JSVtL-XMKHhMZWPPOUh1qcu-gtYNB-$OZ+tLl1aM7ch29mncZ-GwMPL$zKWSunCqWmnLE43VxqYyw695hTgg0kxqZztG1Wp6U9zaM4kVImK9UgxYBnPLqruL4NS-MOJt6O2ejS8rvZX1ZghBB8uvriadrT64ulPN2XV-GZ-nxxdEnV6hnERR$elNnUiLqJlNpJOKxUB0u8mgMZCMId5r6JhxpmDaUFCzmd4kxW6NF2DwLbrqr8AnzSLkKLe94d8GcbFmAd0ZJ1DVcnB+mMvk3E0R0tMzKh$kptD8R0vo-Yo7xYn+X1P$F8+hhJJoDH-Sun8vOqb89V2+rdKkUKpHt0GThn6MBRo-9OtkOHL8ngzmbafdM$-ThjZclM8vnBzBGU1$2qiqgarTDFhFSQFaeNaKVJrDEd++iSXHl6UU6o3mp6$nDTzlSU+b+0x7ny7OrWkGASgxBE4lCUUJ+CAMo+PjGXuCocO9JlAY7bEOMU1K1EOWQV-uewmdTka+YJttnfqb+gNrKPgyJDu3A+d9idCiqwwnuIDICbKizEDd0$yiZtpK-M$laFcaq6nlUNOgBMOJREHcn0boNnzP$+DjMozH9xE1ix-YA$hV+H4BmXoBZ1kVdQ3a5oXev++NfUeL$CMXeh$YoOw9+HrJMclJ9vYduV$vxzUrb+Y+2NYjjnKjO+8YkQF44HKinGb7zkXXgV9VmAwa2KroqJljC8aoViZZaUJx8GVq4nQVDgTDvIGinJCB1MmjlxYH63SAkcpxuZwVJXekWJKk3h3JuNRo-+o$uwe+GvKCDSCy1P9eARv0-Olnhe5O7qUEVmLjJUYm-NBL15vccQFIcybP2fydNrD2UZbeN5fWiy24$-SW3uRtnr9YDc2tz5b$d01bdZ3bbKN51kdV3$yOVSqUJbuhixwkdTmzmPxoKIxB-ppfUTGt6FH$6ZG-6nnII37peFoZ8oufQKy1d2u$DkWIMEY$86Pdci4e8ot6at1vwotEcYCuKWdgmgcgAv0VtLA+oXnOtkG0jAa7Nj6mbhjA$Zc4IBFTu$aZiFzgvU4$6th30jCp0lbN$XH00ZqSH8lqGzClSpZ9GrUq-6eDahxZP4B7ZYNETch$J5CdSbFo86zYXnbKVHnWBGA48fZlwav3Kf$6u6f-q5yxJLHm9ESppEq44BKFxxjhtE314yNXOHgVhvokizUU9eixijQnf3hecatxmyEGi1fJLitN7UgRMovpyLDz77+KYc25RMEKBW4o-bO4nTqp78RCn-bcGAkulAoO2ngPAHC7XaiameXv6BHjuejqgtO6oPLFzOawM-dOXMhtE+0YOPYAeY$FapnveMRb02UAQvoe+xrCiUlE6WfcKbnSlBmOUAjLz6Y7WMD0SwKYbpHv2QCzKbck$URKpyhJiQy7KbtE0GLcRhRSRLgtRSKPeZnTKAHtWRYX1SzbNNX7P1xiGUvJ-VYJF1Arxu3y0pJYXlI78rwUZOrgyoZPF1i9-VOX3BKoQJK4vpgSMwTe3CcN7JW0i7f+DYFGit-V8KDfKA3hO8QICYnmm7wK$HjdNPnx5ZkcIoEBFBA7QeVNn$F+RT5j5mc8UfkPME$DtyAOc+mYJIZ-BaRGMglENh4zlyRwrrg2eDh2JoYcWIcKOq3g30vSltLFSmUIPCQFzcWLmqudQqD7EEe+JgO4kGAJQO4TouI0OXATfd8tXE47pUxphuyG7cWINR+mPB8QYaDXg1nLfPBI-uF9vZbx2Y5rLAJE6iL9cTqm3TRi3XdiElBKEkcT4HdufOx2mATLTN2PDtqj$wP3dTwa$W4Sn9YoL0jF4Ygxhq+njX$OJuJWafOUAMU0h2Jo8tcKMjnnx42JDxix+gfYd8zKtAKbK5Ejrmum5xHNinY$1gJDZrI0i-qZLihje+5vUxtYlnEn1ZUnnjFEQncobCYUnnx6HZ-rVYtwddXrhp$e2DJtwdrUPg4oJbaLNkYnn2e2l0doxFaICdC$b4mNkYlnWowA4pvlVA-CnrhvbN3J7lmTOD3n4HpA8SYoxL7bg5Jt$+kIXdcXvpaqQZtSIRdvX0DMn45yygR0zCehPktq1t85f-JVUdqa2DKV+muofP$cZUxjp52hq3nuzlU4JxHfSXhhQzPpimqNfgfEPPkxTi7x1dwXEncHU9iMizddALP9r+Y7iiRfvXKPDRLGRUNQfZXC3rRyyHWn3dQXzPz+ivyGxDnaf3PlZvnKhZ$g2gyUfZIPJ63Pqwfi2Uqt8xpUgmonPu3qen8QNzcX3gGXpz$xXfkBmIbobMBcp20zuOU++9aVQezxbKfY+onnZgcYZfMOPMtAB7gXm5dJQLW5ucqmbK77vw5Yct8et8Jii$JOAuS1Gt92OoIC1C$04UKxxd70jxoxHlHFSlAYiUxRBM+zZRnUniUfJe2v-ignrU$ndtJ0Nrg8+ImEytFOp421p8kUADegwjVKuEgynFfQbCiS9IjY2INubFuU011D9zpTigZe7zqHTlFnmohmJ72WVEGM$o0eAnnao2JzI9Y4cJZZI1JW0j5YZMgHeT$M7BAk3qSmqPp2ylvw4yqj0QnY75LiXqonn4IYnn",
            "s": "0.9238808077985203:1734545502:TcjYMjL0nHPXps7HqgDjIEj645ZjOl01s0insbKz91E"
        })
        const data = await fetch(`https://api.sunbit.cc/api/login_v?rts=${new Date().getTime()}&hideloading=true`).then(response => response.blob())
        document.getElementById('image').src = URL.createObjectURL(data);
        const info = generateRandomReg()
        setEmail({mailbox: info.email, number: info.phoneNumber})
        setTimeout(() => {
            const captcha = prompt('Nhập captcha')
            axios.post('https://api.robeco-usdt.com/api/register',
                {
                    "a": "+1" + info.phoneNumber,
                    "p": "940289dda3df035b9edb74a11e012aff",
                    "sp": "940289dda3df035b9edb74a11e012aff",
                    "ut": 2,
                    "c": refCode,
                    "em": info.email,
                    "contact_info": "+1" + info.phoneNumber,
                    "em_co": "",
                    "tg": "",
                    "whs": "",
                    "captcha": captcha,
                    "phone_area_code": "+1"
                }).then( response => {
                isLogin && fetchLogin();
            }).catch(error => {
                wait(sleep)
                fetchCreateUser()
                setLoading(false)
            })
        }, 2000)
    }

    const fetchBatchCheckin = async () => {
        const {data: lstAccount} = await axios.get(db, {headers: {'Content-Type': 'application/json'}})
        for (let i = 0; i < lstAccount.length; i++) {
            const {data: encryptData} = await axios.post('https://api.sunbit.cc/api/login',
                {
                    "a": lstAccount[i].mailbox,
                    "p": "940289dda3df035b9edb74a11e012aff",
                    "c": ""
                })
            const p = bu.enc.Hex.parse(bu.SHA256('sl236cl929ki829is0c44928q12ce9ue6').toString())
                , M = bu.enc.Base64.parse(encryptData)
                , o = bu.lib.WordArray.create(M.words.slice(0, 4))
                , t = bu.lib.WordArray.create(M.words.slice(4))
                , z = bu.AES.decrypt({
                ciphertext: t
            }, p, {
                iv: o,
                mode: bu.mode.CBC,
                padding: bu.pad.Pkcs7
            }).toString(bu.enc.Utf8);
            const decrypt = JSON.parse(z)
            await axios.get('https://api.bomofy-ai.com/api/quan/start?rts=' + new Date().getTime(), {
                headers: {
                    token: 'Bearer ' + decrypt.data.t
                }
            })
            await wait(sleep)
        }
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // useEffect(() => {
    //     if (!token) {
    //         // Token is set, can submit here
    //         fetchEmail()
    //     }
    // }, [token]);

    useEffect(() => {
        if (refCode) {
            localStorage.setItem("REFCODE", JSON.stringify(refCode))
        }
    }, [refCode])

    useEffect(() => {
        if (history) {
            localStorage.setItem("HISTORY", JSON.stringify(history))
        }
    }, [history])

    useEffect(() => {
        const ref = localStorage.getItem("REFCODE")
        if (!refCode) {
            if (JSON.parse(ref) != null) {
                setReftCode(JSON.parse(ref))
            }
        }
    }, [])

    return (
        <form className="App">
            <InputText
                style={{
                    marginTop: 10,
                    marginLeft: 0
                }}
                type="refCode"
                value={refCode}
                placeholder="Ref Code"
                onChange={(evt) => setReftCode(evt.target.value)}
            />
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
            <img id={'image'}/>
            <SubmitBtn onClick={fetchCreateUser}>Login</SubmitBtn>
            <SubmitBtn onClick={fetchBatchCheckin}>Batch Checkin</SubmitBtn>
            <p>Lịch sử: {history?.length}</p>
            <div>
                {history.map(item => <div>{item?.mail}-{'Done'}</div>)}
            </div>
            <Loading loading={isLoading} background="transparent" loaderColor="#3498db"/>
            Version:1.14
        </form>
    );
}
