import React from 'react';
import {SearchBarContainer,BodyContentContainer} from '../reduce/ContainerMain';
import PropTypes from 'prop-types';
import TemplateManager from "./CommonComponet/TemplateManager";


class TemplateSelector extends React.Component {
    render() {


      const {templateSelectorKey} = this.props;

      if (templateSelectorKey === 'main')

        return (
            <div>
                <SearchBarContainer />
                <BodyContentContainer/>
            </div>
        );
      else {
          return TemplateManager.getComponentObj(templateSelectorKey);
      }
    }
}



TemplateSelector.propTypes = {
    templateSelecterKey: PropTypes.string.isRequired,
};

TemplateSelector.defaultProps = {
    templateSelecterKey: 'main',
};
export default (TemplateSelector);