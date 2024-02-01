import { useEffect, useRef } from 'react';

export default function AdBanner() {
    const banner = useRef();
    const atOptions = {
        key: '4631aa3dde498abc3bd81862d014a985',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {},
    };

    useEffect(() => {
        if (banner.current && !banner.current.firstChild) {
            const conf = document.createElement('script');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;
            conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

            banner.current.append(conf);
            banner.current.append(script);
        }
    }, [banner]);

    return <div className="banner-ads" ref={banner}></div>;
}