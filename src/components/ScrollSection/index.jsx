import React, { PropTypes } from 'react';

export default class ScrollSection extends React.Component {
  render() {

    return (
      <section
        id={ this.props.id }
        className="rfpn__section"
        ref={ node => this.node = node }>
        { this.props.children }
      </section>
    );
  }
}

ScrollSection.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired
};
