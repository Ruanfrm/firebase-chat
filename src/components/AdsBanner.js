import { useEffect, useRef } from 'react';

export default function AdBanner() {
    const banner = useRef();
    const atOptions = {
        key: '103b7524690660e7b6f4e37964d89a79',
        format: 'iframe',
        height: 250,
        width: 300,
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