export type Theme = {
  primaryColor: string
  secondaryColor: string
  activeTextColor: string
  activeBackgroundColor: string
}

export const orangeTheme: Theme = {
  primaryColor: '#ffb571',
  secondaryColor: '#a53607',
  activeTextColor: '#ffffff',
  activeBackgroundColor: '#f4b77e',
}

export const blueTheme: Theme = {
  primaryColor: '#5d7be2',
  secondaryColor: '#0f3595',
  activeTextColor: '#7e98f4',
  activeBackgroundColor: '#7e98f4',
}

export default { orangeTheme, blueTheme }
