import React from 'react';
import ScrollSection from '../ScrollSection';

import * as smoothScroll from 'smoothscroll-polyfill';

smoothScroll.polyfill();

export default class ScrollContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSection: null
    }
    this.scrollTimer = null;
    this.scrollToSection = this.scrollToSection.bind(this);
    this.getSectionID = this.getSectionID.bind(this);
    this.updateActiveSection = this.updateActiveSection.bind(this);
  }

  componentDidMount() {
    this.updateActiveSection();
    window.addEventListener('scroll', () => {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(this.updateActiveSection, 150);
    }, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.activeSection !== nextState.activeSection;
  }

  scrollToSection(id) {
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  getSectionID(section) {
    return section.props.id ? section.props.id : section.props.title ? section.props.title.replace(' ', '-').toLowerCase() : null;
  }

  updateActiveSection() {
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    this.props.children.forEach(child => {
      const sectionID = this.getSectionID(child);
      const thisSection = document.getElementById(sectionID);

      if ((thisSection.offsetTop - window.innerHeight/2 < scrollTop) && (thisSection.offsetTop + thisSection.clientHeight - window.innerHeight/2 > scrollTop) && sectionID !== this.state.activeSection) {
        this.setState({ activeSection: sectionID });
      }
    });
  }

  render() {
    return (
      <div className="rfpn">
        <nav className="rfpn__nav">
          <ul>
            {
              this.props.children.map((x, i) => {
                return (
                  <li key={ i }>
                    <a

                      className={ 'rfpn__nav-link' + (this.state.activeSection === this.getSectionID(x) ? ' rfpn__nav-link--active' : '') }
                      onClick={ () => this.scrollToSection(this.getSectionID(x)) }
                      >
                      <span className="rfpn__nav-dot" />
                      <span className="rfpn__nav-label">{ x.props.title }</span>
                    </a>
                  </li>
                );
              })
            }
          </ul>
        </nav>
        {
          React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
              id: this.getSectionID(child)
            });
          })
        }
      </div>
    );
  }
}
