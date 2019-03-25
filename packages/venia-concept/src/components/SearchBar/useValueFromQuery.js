import { useEffect } from "react"

import getQueryParameterValue from "src/util/getQueryParameterValue"

const useValueFromQuery = props => {
    const { location, setValue } = props
    const queryValue = getQueryParameterValue({
        location,
        queryParameter: "query"
    })

    useEffect(
        () => {
            setValue(queryValue)
        },
        [setValue, queryValue]
    )
}

export default useValueFromQuery
