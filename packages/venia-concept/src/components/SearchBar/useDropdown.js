import { useCallback, useRef, useState } from 'react';

import useDocumentListener from 'src/util/useDocumentListener';

const useDropdown = () => {
    const elementRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    // collapse on mousedown outside of this element
    const maybeCollapse = useCallback(
        ({ target }) => {
            if (!elementRef.current.contains(target)) {
                setExpanded(false);
            }
        },
        [elementRef.current, setExpanded]
    );

    // add listener to document, as an effect
    useDocumentListener('mousedown', maybeCollapse);

    return {
        expanded,
        elementRef,
        setExpanded
    };
};

export default useDropdown;
