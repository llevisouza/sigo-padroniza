/**
 * Converts a string read as ISO-8859-1 (where each byte maps to its
 * equivalent code point) back to its original UTF-8 bytes, then
 * re-decodes as UTF-8 to recover accented characters.
 * 
 * When using TextDecoder('iso-8859-1'), byte values map directly to
 * Unicode code points (0x00-0xFF → U+0000-U+00FF). This makes the
 * reverse mapping trivial: charCode === original byte value.
 * 
 * Example: "São" in UTF-8 is bytes [0x53, 0xC3, 0xA3, 0x6F]
 * As ISO-8859-1: "S" (0x53) + "Ã" (0xC3) + "£" (0xA3) + "o" (0x6F)
 * Reverse: charCode(S)=0x53, charCode(Ã)=0xC3, charCode(£)=0xA3, charCode(o)=0x6F
 * TextDecoder('utf-8'): [0x53, 0xC3, 0xA3, 0x6F] → "São" ✓
 */
function latin1ToUtf8(str: string): string {
  if (!str) return "";
  
  try {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return str;
  }
}

/**
 * Fixes encoding artifacts in a string.
 * 
 * If the string was read as ISO-8859-1 (via TextDecoder('iso-8859-1')
 * from an ArrayBuffer), the code points directly match the original
 * byte values. We convert back to bytes and decode as UTF-8.
 * 
 * Pure ASCII strings pass through unchanged since their byte values
 * and UTF-8 representations are identical.
 */
export function fixEncoding(str: string | undefined): string {
  if (!str) return "";
  
  // Quick check: if no non-ASCII chars, nothing to decode
  let hasNonAscii = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0x7F) {
      hasNonAscii = true;
      break;
    }
  }
  if (!hasNonAscii) return str;
  
  // Convert ISO-8859-1 code points → bytes → UTF-8
  const decoded = latin1ToUtf8(str);
  
  // If decoding produced replacement characters, fall back to original
  if (decoded.includes('\uFFFD')) {
    return str.replace(/\uFFFD/g, " ").replace(/\s{2,}/g, " ").trim();
  }
  
  return decoded;
}

export function normalizeString(str: string | undefined): string {
  if (!str) return "";
  return fixEncoding(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .toUpperCase()
    .trim();
}

export function onlyDigits(str: string | undefined): string {
  if (!str) return "";
  return str.replace(/\D/g, "");
}

export function isValidCPF(str: string | undefined): boolean {
  const digits = onlyDigits(str);

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (baseLength: number) => {
    let sum = 0;

    for (let index = 0; index < baseLength; index += 1) {
      sum += Number(digits[index]) * (baseLength + 1 - index);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(digits[9]) && calculateDigit(10) === Number(digits[10]);
}

export function normalizeEmail(str: string | undefined): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
