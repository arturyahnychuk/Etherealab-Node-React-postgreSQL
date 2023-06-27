import { useEffect, useRef } from "react";

function useEffectOnce(callback, deps) {
    const isRunOnce = useRef(false);

    useEffect(() => {
        if (!isRunOnce.current) {
            callback();
            isRunOnce.current = true;
        }
    }, deps);
}

export default useEffectOnce;
