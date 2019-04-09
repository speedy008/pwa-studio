import React from "react"

import { mergeClasses } from "src/classify"
import mapProduct from "./mapProduct"
import SuggestedProduct from "./suggestedProduct"
import defaultClasses from "./suggestedProductList.css"

const SuggestedProductList = props => {
    const { limit, products } = props
    const classes = mergeClasses(defaultClasses, props.classes)
    
    const items = products
        .slice(0, limit)
        .map(product => (
            <li key={product.id} className={classes.item}>
                <SuggestedProduct {...mapProduct(product)} />
            </li>
        ))

    return (
        <ul className={classes.root}>
            {items}
        </ul>
    )
}

export default SuggestedProductList

SuggestedProductList.defaultProps = {
    limit: 3
}
