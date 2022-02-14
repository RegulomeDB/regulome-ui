// node_modules
import PropTypes from "prop-types"
import React from "react"

/**
 * Display a list of inline React components with a separator between the items -- sort of like
 * .join() but for React components. By default, the separator is a comma and a space. You can use
 * any sequence of characters as the separator, or even a React component as the separator. Wrap
 * your array of React components you want separated in a SeparatedList component:
 *
 * componentList = [First React component, Second React component, Third React component]
 * <SeparatedList separator = " . ">
 *   {componentList.map((component) => (
 *     <div key={component.id}>{component}</div>
 *   )}
 * </SeparatedList>
 * // Expected output: "First React component . Second React component . Third React component"
 *
 * You can nest SeparatedList components to combine separated lists. Make sure to give each child
 * SeparatedList a unique key:
 *
 * componentList0 = [First component, Second component]
 * componentList1 = [Third component, Fourth component]
 * <SeparatedList separator={<a> LINK </>}>
 *   <SeparatedList key="0">
 *     {componentList0.map((component) => (
 *       <div key={component.id}>{component}</div>
 *     )}
 *   </SeparatedList>
 *   <SeparatedList key="1">
 *     {componentList1.map((component) => (
 *       <div key={component.id}>{component}</div>
 *     )}
 *   </SeparatedList>
 * </SeparatedList>
 * // Expected output: "First component, Second component LINK Third component, Fourth component"
 */
const SeparatedList = ({ separator = ", ", children }) => {
  if (children.length) {
    return (
      <>
        {children
          .map((item) => <React.Fragment key={item.key}>{item}</React.Fragment>)
          .reduce((combined, curr) => [combined, separator, curr])}
      </>
    )
  }
  return <>{children}</>
}

SeparatedList.propTypes = {
  // The separator between the items; ", " by default
  separator: PropTypes.node,
}

export default SeparatedList
