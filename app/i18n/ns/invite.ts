/**
 * i18n namespace: invite — Accept invitation page (valid invite vs expired token).
 * Default export, namespaced under `invite`, with identical en/cs key trees.
 * Proper nouns (Tickitify, the org name, the email address), the doc-title
 * suffix "· Tickitify" and mock data stay out.
 */
export default {
  en: {
    invite: {
      docTitle: 'Accept invitation',
      fieldPasswordLabel: 'Password',
      fieldPasswordPlaceholder: 'At least 8 characters',
      fieldConfirmLabel: 'Confirm password',
      fieldConfirmPlaceholder: 'Repeat it',
      errorPasswordLength: 'Use at least 8 characters.',
      errorPasswordMismatch: "Passwords don't match.",
      toastWelcomeTitle: 'Welcome aboard',
      toastWelcomeDescription: 'Account created — set up payouts before publishing your first event.',
      toastRequestTitle: 'Request sent',
      toastRequestDescription: 'The Tickitify team will send a fresh invitation to ondrej.novak@cvf.cz.',
      validTitle: "You're invited",
      validDescription: 'Set a password to start managing events for your organization.',
      submitLabel: 'Set password & continue',
      footerText: 'Invitation links are valid for 7 days. By continuing you accept the',
      footerLink: 'Data Processing Agreement',
      expiredTitle: 'This invitation has expired',
      expiredDescription: 'Invite links are valid for 7 days. Ask the Tickitify team to send a new one to ondrej.novak@cvf.cz.',
      expiredActionRequest: 'Request a new invite',
      expiredActionBack: 'Back to sign in',
      footNote: 'Accounts are created by the Tickitify team — there is no public sign-up.',
      switcherValid: 'Valid invite',
      switcherExpired: 'Expired link'
    }
  },
  cs: {
    invite: {
      docTitle: 'Přijmout pozvánku',
      fieldPasswordLabel: 'Heslo',
      fieldPasswordPlaceholder: 'Alespoň 8 znaků',
      fieldConfirmLabel: 'Potvrdit heslo',
      fieldConfirmPlaceholder: 'Zopakujte ho',
      errorPasswordLength: 'Použijte alespoň 8 znaků.',
      errorPasswordMismatch: 'Hesla se neshodují.',
      toastWelcomeTitle: 'Vítejte na palubě',
      toastWelcomeDescription: 'Účet vytvořen — před zveřejněním první události nastavte výplaty.',
      toastRequestTitle: 'Žádost odeslána',
      toastRequestDescription: 'Tým Tickitify zašle novou pozvánku na ondrej.novak@cvf.cz.',
      validTitle: 'Máte pozvánku',
      validDescription: 'Nastavte si heslo a začněte spravovat události pro vaši organizaci.',
      submitLabel: 'Nastavit heslo a pokračovat',
      footerText: 'Odkazy z pozvánky platí 7 dní. Pokračováním přijímáte',
      footerLink: 'Smlouvu o zpracování údajů',
      expiredTitle: 'Platnost této pozvánky vypršela',
      expiredDescription: 'Odkazy z pozvánky platí 7 dní. Požádejte tým Tickitify o zaslání nové na ondrej.novak@cvf.cz.',
      expiredActionRequest: 'Požádat o novou pozvánku',
      expiredActionBack: 'Zpět na přihlášení',
      footNote: 'Účty vytváří tým Tickitify — veřejná registrace neexistuje.',
      switcherValid: 'Platná pozvánka',
      switcherExpired: 'Vypršený odkaz'
    }
  }
}
