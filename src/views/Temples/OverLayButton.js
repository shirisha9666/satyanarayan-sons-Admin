import React, { useState, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'

function OverLayButton(props) {
    const { url } = props?.data || ''
    const [show, setShow] = useState(false)
    const target = useRef(null)

    return (
        <span>
            <Button ref={target} onClick={() => setShow(!show)} size="sm" variant="outline-info">
                URL
            </Button>
            <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        <a href={url} target="_blank" className="text-white">
                            {url}
                        </a>
                    </Tooltip>
                )}
            </Overlay>
        </span>
    )
}

export default OverLayButton
