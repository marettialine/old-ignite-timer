import { ThemeProvider } from "styled-components";

import { Button } from "./components/Button";

import { defaultTheme } from './assets/styles/themes/default';
import { GlobalStyle } from "./assets/styles/global";

export function App(){
	// GlobalStyle deve estar dentro do ThemeProvider, caso contrário ele não terá acesso as variáveis do tema
	// Posso colocar ele em qualquer ordem dentro do ThemeProvider
	return (
		<ThemeProvider theme={defaultTheme}>
			<Button variant="primary"/>
			<Button variant="secondary"/>
			<Button variant="success"/>
			<Button variant="danger"/>
			<Button />

			<GlobalStyle />
		</ThemeProvider>
  )
}