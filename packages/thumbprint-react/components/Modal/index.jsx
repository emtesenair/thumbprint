import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import * as tokens from '@thumbtack/thumbprint-tokens';
import { NavigationCloseSmall } from '../../icons/index.jsx';
import { TextButton } from '../Button/index';
import StickyFooter from './components/sticky-footer.jsx';
import Transition from './components/transition.jsx';
import ModalCurtain from '../ModalCurtain/index.jsx';
import styles from './index.module.scss';

const { Provider, Consumer } = React.createContext({
    stickyFooterContainerRef: null,
    setSticky: noop,
});

// These values are duplicated in the Sass.
const TRANSITION_OPEN_SPEED = tokens.tpDuration5;
const TRANSITION_CLOSE_SPEED = tokens.tpDuration4;

/**
 * `ModalAnimatedWrapper` is an exported component that we export for developers that want access to
 * `Modal` without padding and a close button. We export it as a named export instead of
 * creating a `hasNoPadding` prop partly to discourage the use of `Modal` without padding.
 *
 * This component uses `ModalCurtain` and includes the backdrop, transition, and white modal
 * wrapper that is available at a few widths.
 */
const ModalAnimatedWrapper = ({
    children,
    isOpen,
    onCloseClick,
    onCloseFinish,
    onOpenFinish,
    shouldCloseOnCurtainClick,
    width,
    heightAboveSmall,
    shouldPageScrollAboveSmall,
}) => (
    <Transition
        in={isOpen}
        timeout={{
            enter: TRANSITION_OPEN_SPEED,
            exit: TRANSITION_CLOSE_SPEED,
        }}
        onEntered={onOpenFinish}
        onExited={onCloseFinish}
    >
        {transitionStage => (
            <ModalCurtain stage={transitionStage} onCloseClick={onCloseClick}>
                {({ curtainClassName, curtainOnClick }) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                        className={classNames({
                            [curtainClassName]: true,
                            [styles.curtain]: true,
                            [styles.curtainOpen]: isOpen,
                        })}
                    >
                        {/*
                            Extra nested <div> to prevent curtain's
                            bottom padding from being ignored in Firefox and Edge
                            (See #376 and https://github.com/w3c/csswg-drafts/issues/129)

                            onClick listener is attached to this innermost node
                            that constitutes curtain
                        */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <div
                            className={classNames({
                                [styles.curtainInner]: true,
                                [styles.curtainInnerShouldPageScrollAboveSmall]: shouldPageScrollAboveSmall,
                            })}
                            onClick={shouldCloseOnCurtainClick ? curtainOnClick : undefined}
                            data-test="thumbprint-modal-curtain"
                        >
                            <div
                                className={classNames({
                                    [styles.wrapper]: true,
                                    [styles.wrapperOpen]: isOpen,
                                    [styles.wrapperWide]: width === 'wide',
                                    [styles.wrapperNarrow]: width === 'narrow',
                                    [styles.wrapperMedium]: width === 'medium',
                                    [styles.wrapperHeightMedium]: heightAboveSmall === 'medium',
                                    [styles.wrapperHeightTall]: heightAboveSmall === 'tall',
                                    [styles.wrapperShouldPageScrollAboveSmall]: shouldPageScrollAboveSmall,
                                })}
                                data-test="thumbprint-modal-wrapper"
                            >
                                <div
                                    className={classNames({
                                        [styles.container]: true,
                                    })}
                                    data-test="thumbprint-modal-container"
                                >
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ModalCurtain>
        )}
    </Transition>
);

ModalAnimatedWrapper.propTypes = {
    /**
     * Content that appears within the modal.
     */
    children: PropTypes.node,
    /**
     * Function that fires to close the modal.
     */
    onCloseClick: PropTypes.func.isRequired,
    /**
     * Function that fires once the modal has opened and transitions have ended.
     */
    onOpenFinish: PropTypes.func,
    /**
     * Function that fires once the modal has closed and transitions have ended.
     */
    onCloseFinish: PropTypes.func,
    /**
     * Determines if the modal should close when clicking on the curtain, outside of the `children`.
     */
    shouldCloseOnCurtainClick: PropTypes.bool,
    /**
     * Allows the page to scroll vertically at viewports larger than the small breakpoint. If
     * `false`, the modal will always be equal to or smaller than the viewport and the contents
     * of the modal will scroll, not the page itself.
     */
    shouldPageScrollAboveSmall: PropTypes.bool,
    /**
     * Should the modal appear open.
     */
    isOpen: PropTypes.bool,
    /**
     * Sets the max-width of the modal container.
     */
    width: PropTypes.oneOf(['narrow', 'medium', 'wide']),
    /**
     * Sets height of the modal container above small viewport.
     * If `auto` (default), the modal height will be determined by its content.
     * Otherwise, the modal height will be fixed at some constant px.
     */
    heightAboveSmall: PropTypes.oneOf(['auto', 'medium', 'tall']),
};

ModalAnimatedWrapper.defaultProps = {
    children: undefined,
    onOpenFinish: undefined,
    onCloseFinish: undefined,
    isOpen: false,
    shouldCloseOnCurtainClick: true,
    shouldPageScrollAboveSmall: true,
    width: 'medium',
    heightAboveSmall: 'auto',
};

const modalHeaderPropTypes = {
    /**
     * Content (usually a `ModalTitle` and `ModalDescription`) that appears at the top of the
     * modal.
     */
    children: PropTypes.node.isRequired,
};

const modalTitlePropTypes = {
    /**
     * Text that describes the modal contents. It is intended for use within the `ModalHeader`.
     */
    children: PropTypes.string.isRequired,
};

const modalDescriptionPropTypes = {
    /**
     * Text intended for use below a `ModalTitle` and within a `ModalHeader`.
     */
    children: PropTypes.node.isRequired,
};

const modalContentPropTypes = {
    /**
     * Content (usually a form) that makes up the main part of the modal.
     */
    children: PropTypes.node.isRequired,
};

const modalContentFullBleedPropTypes = {
    /**
     * Content (usually a form) that makes up the main part of the modal.
     */
    children: PropTypes.node.isRequired,
    /**
     * Allows the React `className` prop to be passed through to the rendered element.
     */
    className: PropTypes.string,
    /**
     * Allows the React `style` prop to be passed through to the rendered element.
     */
    style: PropTypes.shape(),
};

const modalContentFullBleedDefaultProps = {
    className: '',
    style: {},
};

const modalFooterPropTypes = {
    /**
     * Content (ususally buttons) to render within the footer.
     */
    children: PropTypes.node.isRequired,
    /**
     * Attaches the footer to the bottom of the modal below the small breakpoint.
     */
    isSticky: PropTypes.bool,
};

const modalFooterDefaultProps = {
    isSticky: false,
};

const modalPropTypes = {
    /**
     * Content that appears within the modal.
     */
    children: PropTypes.node,
    /**
     * Function that fires to close the modal.
     */
    onCloseClick: PropTypes.func.isRequired,
    /**
     * Function that fires once the modal has opened and transitions have ended.
     */
    onOpenFinish: PropTypes.func,
    /**
     * Function that fires once the modal has closed and transitions have ended.
     */
    onCloseFinish: PropTypes.func,
    /**
     * Determines if the close button should be rendered. This is generally discouraged and should
     * be used carefully. If used, the contents passed into the modal must contain a focusable
     * element such as a link or button.
     */
    shouldHideCloseButton: PropTypes.bool,
    /**
     * Determines if the modal should close when clicking on the curtain, outside of the `children`.
     */
    shouldCloseOnCurtainClick: PropTypes.bool,
    /**
     * Should the modal appear open.
     */
    isOpen: PropTypes.bool,
    /**
     * Sets the max-width of the modal container.
     */
    width: PropTypes.oneOf(['narrow', 'medium', 'wide']),
    /**
     * Sets height of the modal container above small viewport.
     * If `auto` (default), the modal height will be determined by its content.
     * Otherwise, the modal height will be fixed at some constant px.
     */
    heightAboveSmall: PropTypes.oneOf(['auto', 'medium', 'tall']),
};

const modalProps = {
    children: undefined,
    onOpenFinish: undefined,
    onCloseFinish: undefined,
    isOpen: false,
    shouldHideCloseButton: false,
    shouldCloseOnCurtainClick: true,
    width: 'medium',
    heightAboveSmall: 'auto',
};

const ModalHeader = ({ children }) => <div className={styles.modalHeader}>{children}</div>;

ModalHeader.propTypes = modalHeaderPropTypes;

const ModalTitle = ({ children }) => <div className={styles.modalTitle}>{children}</div>;

ModalTitle.propTypes = modalTitlePropTypes;

const ModalDescription = ({ children }) => (
    <div className={styles.modalDescription}>{children}</div>
);

ModalDescription.propTypes = modalDescriptionPropTypes;

const ModalContent = ({ children }) => <div className={styles.modalContent}>{children}</div>;

ModalContent.propTypes = modalContentPropTypes;

const ModalContentFullBleed = ({ children, className, style }) => (
    <div className={classNames(className, styles.modalContentFullBleed)} style={style}>
        {children}
    </div>
);

ModalContentFullBleed.propTypes = modalContentFullBleedPropTypes;
ModalContentFullBleed.defaultProps = modalContentFullBleedDefaultProps;

class ModalFooter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isClient: false,
        };
    }

    componentDidMount() {
        this.setState({
            isClient: true,
        });
    }

    render() {
        const { isClient } = this.state;
        const { isSticky, children } = this.props;

        if (!isClient) {
            return null;
        }

        return (
            <Consumer>
                {({ stickyFooterContainerRef, setSticky }) => {
                    // When `isSticky` is true, the `ModalFooter` must change it's position in the
                    // DOM so that it is fixed at the bottom of the modal on small viewports. We
                    // use React's Context API so that it is a property of the `ModalFooter`
                    // component and not the `Modal` API.
                    //
                    // `stickyFooterContainerRef` is the DOM element where the sticky footer will
                    // render. `setSticky` is a function that updates the state in `Modal`,
                    // changing the CSS to make the contents scroll and the footer fixed at the
                    // bottom.
                    if (!isSticky) {
                        return <div className={styles.modalFooterFluid}>{children}</div>;
                    }

                    // We have to create a separate component here because `setSticky` updates
                    // state in `Modal` and state updates are not allowed within `render`.
                    // Moving it to a separate component allows us to call it within
                    // `componentDidMount`.
                    // https://blog.kentcdodds.com/answers-to-common-questions-about-render-props-a9f84bb12d5d#6a05
                    return ReactDOM.createPortal(
                        <StickyFooter setSticky={setSticky}>{children}</StickyFooter>,
                        stickyFooterContainerRef.current,
                    );
                }}
            </Consumer>
        );
    }
}

ModalFooter.propTypes = modalFooterPropTypes;
ModalFooter.defaultProps = modalFooterDefaultProps;

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.stickyFooterContainerRef = React.createRef();
        this.state = {
            hasStickyFooter: false,
        };
        this.setSticky = this.setSticky.bind(this);
        this.activeTimeout = null;
    }

    setSticky(newVal) {
        const { hasStickyFooter } = this.state;

        if (newVal !== hasStickyFooter) {
            this.setState({
                hasStickyFooter: newVal,
            });
        }
    }

    render() {
        const {
            children,
            isOpen,
            onCloseClick,
            onCloseFinish,
            onOpenFinish,
            shouldCloseOnCurtainClick,
            shouldHideCloseButton,
            width,
            heightAboveSmall,
        } = this.props;

        const { hasStickyFooter } = this.state;

        return (
            <ModalAnimatedWrapper
                onCloseClick={onCloseClick}
                onOpenFinish={onOpenFinish}
                onCloseFinish={onCloseFinish}
                shouldCloseOnCurtainClick={shouldCloseOnCurtainClick}
                isOpen={isOpen}
                width={width}
                heightAboveSmall={heightAboveSmall}
                // We allow the modal to grow taller than the page only if
                // there is no sticky footer. This means that the page can
                // scroll vertically when the modal contents are tall enough.
                // If we have a sticky footer, we prevent the modal from
                // getting taller than the viewport so that the footer can
                // always appear at the bottom. In this case, the inside
                // of the modal itself will scroll vertically as needed.
                shouldPageScrollAboveSmall={!hasStickyFooter}
            >
                <Provider
                    value={{
                        stickyFooterContainerRef: this.stickyFooterContainerRef,
                        setSticky: this.setSticky,
                    }}
                >
                    <div className={styles.contents}>
                        {/*
                            Extra nested <div> to prevent bottom padding from being ignored
                            in Firefox and Edge
                            (See #376 and https://github.com/w3c/csswg-drafts/issues/129)
                        */}
                        <div
                            className={classNames(styles.contentsPadding, {
                                [styles.contentsPaddingNotSticky]: !hasStickyFooter,
                            })}
                        >
                            {children}
                        </div>
                    </div>
                    {/*
                        If a user uses `<ModalFooter isSticky />`, it gets
                        moved here with React portals.
                    */}
                    <div ref={this.stickyFooterContainerRef} />
                    {/*
                        The close button is last in the DOM so that it is
                        not focused first by the focus trap. We visually
                        position it at the top with flexbox.
                    */}
                    <div
                        className={classNames({
                            [styles.closeButton]: true,
                            [styles.closeButtonNotSticky]: !hasStickyFooter,
                        })}
                    >
                        {shouldHideCloseButton === false && (
                            <TextButton
                                accessibilityLabel="Close modal"
                                iconLeft={
                                    <NavigationCloseSmall className={styles.closeButtonIcon} />
                                }
                                onClick={onCloseClick}
                                theme="inherit"
                            />
                        )}
                    </div>
                </Provider>
            </ModalAnimatedWrapper>
        );
    }
}

Modal.propTypes = modalPropTypes;
Modal.defaultProps = modalProps;

export default Modal;
export {
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalContentFullBleed,
    ModalFooter,
    ModalAnimatedWrapper,
};
