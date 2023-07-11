import { ButtonContainer, ButtonVariant } from '../assets/styles/Button.styles';

interface ButtonProps{
    variant?: ButtonVariant;
}

export function Button({variant = 'primary'}: ButtonProps){
    return <ButtonContainer variant = {variant}>Enviar</ButtonContainer>
}