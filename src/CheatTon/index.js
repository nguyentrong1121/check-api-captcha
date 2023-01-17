import React, {useEffect, useRef, useState} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import ReCAPTCHA from "react-google-recaptcha";

export default () => {

    const captchaRef = useRef(null);

    console.log(captchaRef.current)

    function onChange(value) {
        console.log("Captcha value:", value);
    }
    return (
        <form className="App">
            <ReCAPTCHA
                ref={captchaRef}
                sitekey="Your client site key"
                onChange={onChange}
                sitekey={'6LcvQtkhAAAAAF_-x9pdXxBAWCMSpDUur5g9UGpO'}
            />
        </form>
    );
}
