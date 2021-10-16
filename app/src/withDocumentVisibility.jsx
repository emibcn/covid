import React from 'react'

// From: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// Side effects: adds an event listener to document on mount and removes it on unmount

// Set the name of the hidden property and the change event for visibility
const { hidden, visibilityChange } =
  typeof document.hidden !== 'undefined' // Opera 12.10 and Firefox 18 and later support
    ? {
        hidden: 'hidden',
        visibilityChange: 'visibilitychange'
      }
    : typeof document.msHidden !== 'undefined' // IE/Edge?
      ? {
          hidden: 'msHidden',
          visibilityChange: 'msvisibilitychange'
        }
      : typeof document.webkitHidden !== 'undefined' // Webkit
        ? {
            hidden: 'webkitHidden',
            visibilityChange: 'webkitvisibilitychange'
          }
        : {}

// Checks if tab is currently visible
const checkVisibility = () => !document[hidden]

// HOC adding `visible` prop to Wrapped component (`true` for incompatible browsers)
const withDocumentVisibility = (Wrapped) => {
  // This component will be returned in case of a non-compatible browser
  function WithoutDocumentVisibility (props) {
    <Wrapped {...props} visible />
  }

  // TODO: Backward compatibility using window.blur and window.focus?
  if (
    typeof document.addEventListener === 'undefined' ||
    typeof hidden === 'undefined'
  ) {
    console.warn(
      'This component requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
    )

    return WithoutDocumentVisibility
  }

  function WithDocumentVisibility (props) {
    const [visible, setVisible] = React.useState(checkVisibility())

    React.useEffect(() => {
      // Handle page visibility change
      const handleVisibilityChange = () => setVisible(checkVisibility())
      document.addEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      )

      // Remove event listener on unmount
      return () =>
        document.removeEventListener(
          visibilityChange,
          handleVisibilityChange,
          false
        )
    }, [])

    return <Wrapped {...props} visible={visible} />
  }

  return WithDocumentVisibility
}

export default withDocumentVisibility
