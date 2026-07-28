const ENV_KEY = "DEMO_COMPANY_TAX_ID";

export function getDemoCompanyTaxId(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const value = env[ENV_KEY]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable ${ENV_KEY}. ` +
        `Set it in .env.local (see .env.example).`,
    );
  }
  return value;
}
