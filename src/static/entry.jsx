import { renderToStaticMarkup } from 'react-dom/server';
import StaticApp from './StaticApp';

export function render(props) {
  return renderToStaticMarkup(<StaticApp {...props} />);
}
