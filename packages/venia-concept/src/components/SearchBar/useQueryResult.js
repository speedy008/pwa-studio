import { useState } from "react"

const useQueryResult = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    return { data, error, loading, setData, setError, setLoading }
}

export default useQueryResult
