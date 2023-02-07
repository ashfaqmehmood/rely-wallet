export default {
  actions: {
    continue: 'Continue',
  },
  example: {
    helloUser: 'I am a fake user, my name is {{name}}',
    labels: {
      userId: 'Enter a user id',
    },
  },
  home: {
    balance: 'Balance: {{amount}}',
    send: 'Send',
    receive: 'Receive',
    transactions: 'Transactions',
    labels: {
      address: 'Enter ethereum address'
    },
    errors: {
      invalidAddress: 'Invalid address'
    }
  },
  onboarding: {
    title1: 'Welcome to the Rely',
    title2: 'Nice and Tidy Crypto Portfolio!',
    title3: 'Receive and Send Money to Friends!',
    title4: 'Your gateway to the web3 world!',

    subtitle1: 'Manage all your crypto assets! It’s simple and easy!',
    subtitle2: 'Track your crypto portfolio in one place.',
    subtitle3: 'Send and receive money to friends and family.',
    subtitle4: 'Buy and sell crypto assets with ease. Play games, invest, trade, and more!',
  },
  welcome: {
    title: 'Create a wallet or import an existing wallet',
    setup: 'Wallet Setup',
    button: 'Get Started',
    import: 'Import Wallet',
    create: 'Create Wallet',
    agree: 'By continuing, you agree to the ',
    terms: 'Terms of Service and Privacy Policy',
  },
  import: {
    // title: 'Import from seed phrase',
    title: 'Enter your seed phrase to import your wallet. This is a 12 or 24 word phrase.',
    seedPhrase: 'Seed Phrase',
    password: 'New Password',
    confirmPassword: 'Confirm Password',
    touchId: 'Sign in with Biometrics?',
    import: 'Import Wallet',
    mnemonic: 'Mnemonic',
    errors: {
      invalidMnemonic: 'Mnemonic is invalid! Please check again.',
      passwordsDoNotMatch: 'Passwords do not match.',
      passwordLength: 'Password must be at least 8 characters.',
    },
  },
  scan: {
    permission: 'Permission',
    permissionDenied: 'We need permission to use your camera to scan QR codes',
    permissionDeniedAction: 'Go to Settings'
  },
  create: {
    title: 'Create Wallet',
    description: 'This password will be used to unlock your wallet only on this device. Please make sure to remember it.',
    password: 'New Password',
    confirmPassword: 'Confirm Password',
    touchId: 'Sign in with Biometrics?',
    create: 'Create Password',
    secureWallet: 'Secure your wallet',
    secureWalletDescription: 'Please make sure to write down your seed phrase and keep it in a safe place. If you lose your seed phrase, you will lose access to your wallet.',
    next: 'Next',
    confirmSeedPhrase: 'Confirm Your Seed Phrase', 
    confirmSeedPhraseDescription: 'Please select the words in the correct order to confirm your seed phrase.',
    errors: {
      passwordsDoNotMatch: 'Passwords do not match.',
      passwordLength: 'Password must be at least 8 characters.',
    },
  },
}
