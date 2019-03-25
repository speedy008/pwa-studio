import React, { useCallback } from "react"
import { Form } from "informed"

import { mergeClasses } from "src/classify"
import Autocomplete from "./autocomplete"
import SearchField from "./searchField"
import useDropdown from "./useDropdown"
import defaultClasses from "./searchBar.css"

const initialValues = { search_query: "" }

const SearchBar = props => {
    const { history, isOpen, location } = props
    const { elementRef, expanded, setExpanded } = useDropdown()

    const classes = mergeClasses(defaultClasses, props.classes)
    const rootClassName = isOpen ? classes.root_open : classes.root

    // expand or collapse on input change
    const handleChange = useCallback(
        value => {
            setExpanded(!!value)
        },
        [setExpanded]
    )

    // expand on focus
    const handleFocus = useCallback(
        () => {
            setExpanded(true)
        },
        [setExpanded]
    )

    // navigate on submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            history.push(`/search.html?query=${search_query}`)
        },
        [history]
    )

    return (
        <div className={rootClassName}>
            <div ref={elementRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.search}>
                        <SearchField
                            location={location}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                    <div className={classes.autocomplete}>
                        <Autocomplete
                            setVisible={setExpanded}
                            visible={expanded}
                        />
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SearchBar
