/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {Footer, FooterText} from 'react-weui';
import PropTypes from 'prop-types';

// Viewers Component — Who has joined the list, and who is viewing it.
const Viewers = ({viewerId, users}) => {
  if (users.length <= 1) { return null; }

  const {activeCount, viewers} = users.reduce(
    ({activeCount, viewers}, user) => {
      if (user.fbId === viewerId) {
        return {activeCount, viewers};
      }

    // Attributes
      const {fbId, online, profilePic} = user;
      const className = `viewer ${online ? 'active' : ''}`;

    // Construct viewer
      const viewer = <img key={fbId} src={profilePic} className={className} />;

    // Accumulate
      return {
        activeCount: (user.online ? activeCount + 1 : activeCount),
        viewers: viewers.concat(viewer),
      };
    },
    {activeCount: 0, viewers: []}
  );

  return (
    <section id='viewers'>
      <ReactCSSTransitionGroup
        className='viewers-list-cntnr'
        transitionName='viewer'
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {viewers}
      </ReactCSSTransitionGroup>

      <Footer id='viewer-count'>
        <FooterText>
          {activeCount}/{viewers.length} people are viewing this list right now
        </FooterText>
      </Footer>
    </section>
  );
};

Viewers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      fbId: PropTypes.string.isRequired,
      online: PropTypes.bool.isRequired,
      profilePic: PropTypes.string,
    })
  ).isRequired,
  viewerId: PropTypes.string.isRequired,
};

export default Viewers;
