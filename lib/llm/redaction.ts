const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX =
  /(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?[\d\s.-]{7,}\d/g;
const URL_REGEX = /\bhttps?:\/\/[^\s]+/gi;

export function redactContactInfo(text: string): string {
  return text
    .replace(EMAIL_REGEX, "[redacted-email]")
    .replace(PHONE_REGEX, "[redacted-phone]")
    .replace(URL_REGEX, "[redacted-url]");
}
