/* Goal: 
   Wait 500ms after user stops typing
   Then call API.

   This is called Debouncing.
*/

import {useState, useEffect} from 'react';

export function useDebounce<T>(value:T, delay:number){
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() =>{
            setDebouncedValue(value)
        }, delay)

        return () =>{
            clearTimeout(timer)
        };
    }, [value, delay]);

    return debouncedValue
}