import React from "react"
import { Link } from "src/drivers"

import { mergeClasses } from "src/classify"
import getLocation from "./getLocation"
import defaultClasses from "./suggestedCategoryList.css"

const SuggestedCategoryList = props => {
    const { categories, limit, value } = props
    const classes = mergeClasses(defaultClasses, props.classes)

    const items = categories
        .slice(0, limit)
        .map(({ label, value_string: categoryId }) => (
            <li key={categoryId} className={classes.item}>
                <Link
                    className={classes.link}
                    to={getLocation(value, categoryId)}
                >
                    <strong className={classes.value}>{value}</strong>
                    <span>{` in ${label}`}</span>
                </Link>
            </li>
        ))

    return (
        <ul className={classes.root}>
            {items}
        </ul>
    )
}

export default SuggestedCategoryList

SuggestedCategoryList.defaultProps = {
    limit: 4
}
