export const countryCallingCodes = [
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263" },
  { iso: "BW", name: "Botswana", dial: "+267" },
  { iso: "NA", name: "Namibia", dial: "+264" },
  { iso: "MZ", name: "Mozambique", dial: "+258" },
  { iso: "LS", name: "Lesotho", dial: "+266" },
  { iso: "SZ", name: "Eswatini", dial: "+268" },
  { iso: "ZM", name: "Zambia", dial: "+260" },
  { iso: "MW", name: "Malawi", dial: "+265" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "CN", name: "China", dial: "+86" },
] as const;

export const defaultCountryDial = "+27";

export function isKnownDialCode(value: string) {
  return countryCallingCodes.some((item) => item.dial === value);
}

export function formatInternationalPhone(dial: string, national: string) {
  const digits = national.replace(/[^\d]/g, "");
  return `${dial} ${digits}`.trim();
}
