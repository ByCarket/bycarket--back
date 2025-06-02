import { PhoneNumber } from 'src/interfaces/phone.interface';

export class PhoneUtil {
  /**
   * Formatea un objeto PhoneNumber a string legible
   * @param phone - Objeto con código de país, área y número
   * @returns String formateado como "+XX XXX XXXXXXX"
   */
  static formatPhoneNumber(phone: PhoneNumber): string {
    if (!phone || !phone.countryCode || !phone.areaCode || !phone.number) {
      return '';
    }
    return `${phone.countryCode} ${phone.areaCode} ${phone.number}`;
  }

  /**
   * Formatea un objeto PhoneNumber para mostrar en la UI
   * @param phone - Objeto con código de país, área y número
   * @returns String formateado como "(+XX) XXX-XXXXXXX"
   */
  static formatPhoneForDisplay(phone: PhoneNumber): string {
    if (!phone || !phone.countryCode || !phone.areaCode || !phone.number) {
      return 'No phone number';
    }
    return `(${phone.countryCode}) ${phone.areaCode}-${phone.number}`;
  }

  /**
   * Parsea un string de teléfono a objeto PhoneNumber
   * @param phoneString - String en formato "+XX XXX XXXXXXX" o "+XX-XXX-XXXXXXX"
   * @returns Objeto PhoneNumber o null si no es válido
   */
  static parsePhoneNumber(phoneString: string): PhoneNumber | null {
    if (!phoneString || typeof phoneString !== 'string') {
      return null;
    }

    // Limpiar el string de espacios extra y caracteres especiales
    const cleanPhone = phoneString.trim().replace(/[-()]/g, ' ').replace(/\s+/g, ' ');
    
    // Regex para parsear formato: +XX XXX XXXXXXX
    const phoneRegex = /^\+(\d{1,3})\s(\d{2,4})\s(\d{4,10})$/;
    const match = cleanPhone.match(phoneRegex);
    
    if (match) {
      return {
        countryCode: `+${match[1]}`,
        areaCode: match[2],
        number: match[3]
      };
    }
    
    return null;
  }

  /**
   * Valida si un objeto PhoneNumber es válido
   * @param phone - Objeto PhoneNumber a validar
   * @returns true si es válido, false si no
   */
  static isValidPhoneNumber(phone: PhoneNumber): boolean {
    if (!phone) return false;
    
    const countryCodeRegex = /^\+\d{1,3}$/;
    const areaCodeRegex = /^\d{2,4}$/;
    const numberRegex = /^\d{4,10}$/;
    
    return (
      countryCodeRegex.test(phone.countryCode) &&
      areaCodeRegex.test(phone.areaCode) &&
      numberRegex.test(phone.number)
    );
  }

  /**
   * Obtiene solo los dígitos del teléfono (útil para APIs externas)
   * @param phone - Objeto PhoneNumber
   * @returns String con solo números
   */
  static getPhoneDigitsOnly(phone: PhoneNumber): string {
    if (!phone) return '';
    
    const countryCode = phone.countryCode.replace('+', '');
    return `${countryCode}${phone.areaCode}${phone.number}`;
  }

  /**
   * Convierte PhoneNumber a formato internacional estándar E.164
   * @param phone - Objeto PhoneNumber
   * @returns String en formato E.164 (+XXXXXXXXXXXX)
   */
  static toE164Format(phone: PhoneNumber): string {
    if (!this.isValidPhoneNumber(phone)) return '';
    
    const countryCode = phone.countryCode.replace('+', '');
    return `+${countryCode}${phone.areaCode}${phone.number}`;
  }
}