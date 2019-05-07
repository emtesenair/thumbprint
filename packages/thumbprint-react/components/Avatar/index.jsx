import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SmartImage } from '../Image/index.jsx';
import Badge from './subcomponents/badge.jsx';
import styles from './index.module.scss';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 13">
        <path
            d="M17 .943c0 .26-.1.5-.28.69L5.81 12.713c-.18.18-.43.28-.69.29-.26 0-.51-.11-.69-.29 0 0-3.79-3.78-4.16-4.16a.942.942 0 0 1-.27-.69c0-.26.11-.5.3-.68.39-.36 1-.34 1.37.04.26.27 2.33 2.34 3.44 3.44L15.33.293c.37-.38.98-.39 1.37-.03.18.18.29.42.3.68"
            fillRule="evenodd"
        />
    </svg>
);

const getBadgeProps = ({ size, hasUnreadNotifications, isChecked, isOnline }) => {
    const props = {
        size,
    };

    if (hasUnreadNotifications) {
        props.background = 'red';
    } else if (isChecked) {
        props.children = <CheckIcon />;
        props.background = 'green';
    } else if (isOnline) {
        props.background = 'green';
    }

    return props;
};

const shouldShowBadge = ({ size, hasUnreadNotifications, isChecked, isOnline }) =>
    size !== 'xsmall' && (hasUnreadNotifications || isChecked || isOnline);

const EntityAvatar = ({ imageUrl, size, initial, sources, fullName }) => (
    <div
        className={classNames(styles.root, {
            [styles.rootSmall]: size === 'small',
            [styles.rootMedium]: size === 'medium',
            [styles.rootLarge]: size === 'large',
            [styles.rootXlarge]: size === 'xlarge',
        })}
    >
        {imageUrl ? (
            <SmartImage
                className={styles.squareAvatar}
                src={imageUrl}
                sources={sources}
                alt={fullName && `Avatar for ${fullName}`}
                title={fullName && `Avatar for ${fullName}`}
                aspectRatio="1:1"
            />
        ) : (
            <span
                className={`${styles.initialsAvatar} ${styles.squareAvatar}`}
                title={fullName && `Avatar for ${fullName}`}
            >
                {initial}
            </span>
        )}
    </div>
);

EntityAvatar.propTypes = {
    /**
     * HTTPS URL that points a user's avatar. The `imageURL` will take
     * precendence over `initials` if both are supplied.
     */
    imageUrl: PropTypes.string,
    /**
     * Allows the browser to choose the best file format and image size based on the device screen
     * density and the width of the rendered image.
     */
    sources: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(['image/webp', 'image/jpeg', 'image/png', 'image/gif'])
                .isRequired,
            srcSet: PropTypes.string.isRequired,
        }),
    ),
    /**
     * The entity's initial. This should be passed in as a one character string.
     */
    initial: PropTypes.string,
    /**
     * The user's full name. This is used as `title` and `alt` text.
     */
    fullName: PropTypes.string,
    /**
     * The set of avatar sizes that we support.
     */
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
};

EntityAvatar.defaultProps = {
    imageUrl: undefined,
    sources: undefined,
    initial: undefined,
    fullName: undefined,
    size: 'medium',
};

const Avatar = props => {
    const { size, imageUrl, fullName, sources, initials } = props;

    return (
        <div
            className={classNames(styles.root, {
                [styles.rootXsmall]: size === 'xsmall',
                [styles.rootSmall]: size === 'small',
                [styles.rootMedium]: size === 'medium',
                [styles.rootLarge]: size === 'large',
                [styles.rootXlarge]: size === 'xlarge',
            })}
        >
            {imageUrl ? (
                <SmartImage
                    className={`${styles.circleAvatar}`}
                    src={imageUrl}
                    sources={sources}
                    alt={fullName && `Avatar for ${fullName}`}
                    title={fullName && `Avatar for ${fullName}`}
                    aspectRatio="1:1"
                />
            ) : (
                <span
                    className={`${styles.initialsAvatar} ${styles.circleAvatar}`}
                    title={fullName && `Avatar for ${fullName}`}
                >
                    {initials}
                </span>
            )}
            {shouldShowBadge(props) && <Badge {...getBadgeProps(props)} />}
        </div>
    );
};

Avatar.propTypes = {
    /**
     * HTTPS URL that points a user's avatar. The `imageURL` will take
     * precendence over `initials` if both are supplied.
     */
    imageUrl: PropTypes.string,
    /**
     * Allows the browser to choose the best file format and image size based on the device screen
     * density and the width of the rendered image.
     */
    sources: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(['image/webp', 'image/jpeg', 'image/png', 'image/gif'])
                .isRequired,
            srcSet: PropTypes.string.isRequired,
        }),
    ),
    /**
     * The user's initials. This should be passed in as a two character string
     * for best results.
     */
    initials: PropTypes.string,
    /**
     * The user's full name. This is used as `title` and `alt` text.
     */
    fullName: PropTypes.string,
    /**
     * The set of avatar sizes that we support.
     */
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
    /**
     * Displays a badge of a checkmark next to the `Avatar`.
     */
    isChecked: PropTypes.bool,
    /**
     * Should be true if the user has unread notifications. Displays a badge
     * as an indication.
     */
    hasUnreadNotifications: PropTypes.bool,
    /**
     * Displays a badge if the user is online.
     */
    isOnline: PropTypes.bool,
};

Avatar.defaultProps = {
    imageUrl: undefined,
    sources: undefined,
    initials: undefined,
    fullName: undefined,
    size: 'medium',
    isChecked: false,
    hasUnreadNotifications: false,
    isOnline: undefined,
};

export default Avatar;
export { EntityAvatar };
