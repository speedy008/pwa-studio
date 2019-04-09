import React, { Fragment } from "react"

import { mergeClasses } from "src/classify"
import SuggestedCategoryList from "./suggestedCategoryList"
import SuggestedProductList from "./suggestedProductList"
import defaultClasses from "./suggestions.css"

const Suggestions = props => {
    const { products, searchValue, visible } = props
    const { filters, items } = products
    const classes = mergeClasses(defaultClasses, props.classes)

    if (!visible || !filters || !items) {
        return null
    }

    const categoryFilter = filters.find(({ name }) => name === "Category") || {}
    const categories = categoryFilter.filter_items || []

    return (
        <Fragment>
            <SuggestedCategoryList
                categories={categories}
                value={searchValue}
            />
            <h2 className={classes.heading}>
                <span>{"Product Suggestions"}</span>
            </h2>
            <SuggestedProductList
                products={items}
            />
        </Fragment>
    )
}

export default Suggestions
