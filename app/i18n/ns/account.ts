/**
 * i18n namespace: account — Account settings component (brand/profile,
 * Stripe Connect / KYC, organization, sign-in & security).
 * Default export, namespaced under `account`, with identical en/cs key trees.
 * Proper nouns (Tickitify, Stripe, Fio banka, CVF), formatted values and mock
 * data (KYC steps, bank account, verified label) stay out.
 */
export default {
  en: {
    account: {
      // brand / profile header
      changeCover: 'Change cover',
      brandSubtitle: 'Organizer brand · shown on your storefront and tickets',
      changePhoto: 'Change photo',

      // Stripe Connect / KYC
      payoutsTitle: 'Payouts · Stripe Connect',
      payoutsDescription: 'Verification and bank details are handled by Stripe — we never store them ourselves.',
      kycVerification: 'KYC verification',
      kycVerifiedBadge: 'Verified',
      kycSince: 'since {date} · publishing events is enabled',
      manageInStripe: 'Manage in Stripe',
      bankLabel: 'Bank',
      accountLabel: 'Account',
      payoutCurrencyLabel: 'Payout currency',

      // organization
      organizationTitle: 'Organization',
      organizationDescription: 'How your brand appears to buyers — on the storefront, tickets and emails.',
      displayNameLabel: 'Display name',
      displayNameHelp: 'Shown on the storefront and on every ticket.',
      saveChanges: 'Save changes',

      // sign-in & security
      securityTitle: 'Sign-in & security',
      securityDescription: 'Your organizer account credentials.',
      passwordLastChanged: 'password last changed 5 May 2026',
      changePassword: 'Change password',

      // toasts
      orgSavedTitle: 'Organization saved',
      stripeToastTitle: 'Stripe onboarding opens here',
      stripeToastDesc: 'Bank details and verification are managed on a Stripe-hosted page — status updates back automatically.',
      resetToastTitle: 'Reset link sent',
      resetToastDesc: 'Check ondrej.novak@cvf.cz — the link is valid for a limited time.',
      coverToastTitle: 'Cover upload opens here',
      coverToastDesc: 'Pick a banner for your storefront — prototype placeholder.',
      photoToastTitle: 'Photo upload opens here',
      photoToastDesc: 'Pick your brand logo — prototype placeholder.'
    }
  },
  cs: {
    account: {
      // brand / profile header
      changeCover: 'Změnit obálku',
      brandSubtitle: 'Značka organizátora · zobrazena na vaší prodejní stránce a vstupenkách',
      changePhoto: 'Změnit fotku',

      // Stripe Connect / KYC
      payoutsTitle: 'Výplaty · Stripe Connect',
      payoutsDescription: 'Ověření a bankovní údaje řeší Stripe — sami je nikdy neukládáme.',
      kycVerification: 'Ověření KYC',
      kycVerifiedBadge: 'Ověřeno',
      kycSince: 'od {date} · publikování událostí je povoleno',
      manageInStripe: 'Spravovat ve Stripe',
      bankLabel: 'Banka',
      accountLabel: 'Účet',
      payoutCurrencyLabel: 'Měna výplaty',

      // organization
      organizationTitle: 'Organizace',
      organizationDescription: 'Jak se vaše značka zobrazuje kupujícím — na prodejní stránce, vstupenkách a v e-mailech.',
      displayNameLabel: 'Zobrazované jméno',
      displayNameHelp: 'Zobrazeno na prodejní stránce a na každé vstupence.',
      saveChanges: 'Uložit změny',

      // sign-in & security
      securityTitle: 'Přihlášení a zabezpečení',
      securityDescription: 'Přihlašovací údaje vašeho účtu organizátora.',
      passwordLastChanged: 'heslo naposledy změněno 5. května 2026',
      changePassword: 'Změnit heslo',

      // toasts
      orgSavedTitle: 'Organizace uložena',
      stripeToastTitle: 'Zde se otevře onboarding Stripe',
      stripeToastDesc: 'Bankovní údaje a ověření se spravují na stránce hostované Stripe — stav se automaticky aktualizuje zpět.',
      resetToastTitle: 'Odkaz pro obnovení odeslán',
      resetToastDesc: 'Zkontrolujte ondrej.novak@cvf.cz — odkaz je platný po omezenou dobu.',
      coverToastTitle: 'Zde se otevře nahrání obálky',
      coverToastDesc: 'Vyberte banner pro vaši prodejní stránku — zástupný prvek prototypu.',
      photoToastTitle: 'Zde se otevře nahrání fotky',
      photoToastDesc: 'Vyberte logo své značky — zástupný prvek prototypu.'
    }
  }
}
