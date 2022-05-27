import { screen, render } from "@testing-library/react";
import InputField from "../components/InputField";


test('should render input field', ()=> {
  render(<InputField name={'hello'} label="hello" placeholder ="hello"/>);
  screen.getByPlaceholderText('hello');
  screen.getByLabelText('hello');
})