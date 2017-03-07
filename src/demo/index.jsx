import React from 'react';
import ReactDOM from 'react-dom';

import { ScrollContainer, ScrollSection } from '../components';
// import ScrollSection from '../components';

class App extends React.Component {
  render() {
    return (
      <ScrollContainer>
        <ScrollSection title="Section 1">
          <h2>Section 1</h2>
        </ScrollSection>

        <ScrollSection title="Section 2">
          <h2>Section 2</h2>
        </ScrollSection>

        <ScrollSection title="Section 3">
          <h2>Section 3</h2>
        </ScrollSection>
      </ScrollContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
