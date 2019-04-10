import { useEffect } from 'react';

export default (type, listener, ...rest) => {
    useEffect(() => {
        document.addEventListener(type, listener, ...rest);

        // return a callback, which is called on unmount
        return () => {
            document.removeEventListener(type, listener, ...rest);
        };
    }, [listener, type]);
};
