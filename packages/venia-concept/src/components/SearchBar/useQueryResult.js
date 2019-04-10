import { useReducer } from 'react';

const initialState = {
    data: null,
    error: null,
    loading: false
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'set data': {
            return { ...state, data: payload };
        }
        case 'set error': {
            return { ...state, error: payload };
        }
        case 'set loading': {
            return { ...state, loading: payload };
        }
        case 'receive response': {
            const { data, error } = payload;

            return {
                data: data || null,
                error: error || null,
                loading: false
            };
        }
        case 'reset state': {
            return initialState;
        }
        default: {
            throw new Error(`Received an unexpected action type: ${type}`);
        }
    }
};

const useQueryResult = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return { ...state, dispatch };
};

export default useQueryResult;
