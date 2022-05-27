import { screen, render } from "@testing-library/react";
import ButtonSmall from "../components/ButtonSmall";

test('should render button', ()=> {
  render(<ButtonSmall content={'button1'} fill={true}/>);
  screen.getByText('button1');
  expect(screen.getByText('button1')).toHaveClass('fill');

  render(<ButtonSmall content={'button2'} fill={false}/>);
  screen.getByText('button2');
  expect(screen.getByText('button2')).toHaveClass('nofill');
})